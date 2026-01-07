import sqlite3
import csv
import argparse
import os
import re
import sys
from tqdm import tqdm

def read_schema(schema_file):
    """
    Read a schema file (.schema). Supports optional third column 'IGNORE'.
    Returns:
        - columns: list of SQL column definitions
        - column_names: list of column names to use in INSERT
    """
    columns = []
    column_names = []

    with open(schema_file, "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")
        for row in reader:
            if len(row) < 2:
                raise ValueError(f"Invalid schema line in {schema_file}: {row}")
            col_name, col_type = row[0], row[1]

            columns.append(f"{col_name} {col_type}")
            column_names.append(col_name)

    return columns, column_names

def insert_txt_file(txt_file, table_name, schema_file, sqlite_db, extra_cols=None, skip_first_row_files=None):
    """
    Insert txt file into a table; optionally skip first row for certain files.
    extra_cols: dict of {col_name: (value, type)}
    skip_first_row_files: set of filenames to skip the first row
    """
    filename = os.path.basename(txt_file)
    skip_first_row = skip_first_row_files and filename in skip_first_row_files

    if not os.path.exists(schema_file):
        print(f"⚠️  Skipping {txt_file}: missing schema file {schema_file}")
        return

    columns, column_names = read_schema(schema_file)

    if extra_cols:
        for col_name, value in extra_cols.items():
            columns.append(f"{col_name} {value[1]}")
            column_names.append(col_name)

    boolean_indices = [i for i, col_def in enumerate(columns) if "BOOLEAN" in col_def.upper()]

    conn = sqlite3.connect(sqlite_db)
    cursor = conn.cursor()

    create_sql = f"""CREATE TABLE IF NOT EXISTS "{table_name}" ({", ".join(columns)});"""
    cursor.execute(create_sql)

    placeholders = ", ".join(["?"] * len(column_names))
    insert_sql = f"""INSERT INTO "{table_name}" ({", ".join(column_names)}) VALUES ({placeholders})"""

    with open(txt_file, "r", encoding="utf-8") as f:
        total_lines = sum(1 for line in f if not line.startswith("#"))
        if skip_first_row:
            total_lines = max(total_lines - 1, 0)

    with open(txt_file, "r", encoding="utf-8") as f, tqdm(total=total_lines, desc=f"Importing {filename}", unit="rows") as pbar:
        reader = csv.reader(f, delimiter="\t")
        first_row = True
        batch = []
        batch_size = 1000
        for row in reader:
            if not row or row[0].startswith("#"):
                continue

            if skip_first_row and first_row:
                first_row = False
                continue

            first_row = False

            # BOOLEAN conversion
            for i in boolean_indices:
                if row[i] == '1':
                    row[i] = True
                elif row[i] != '':
                    row[i] = False

            # Extra columns
            if extra_cols:
                for val in extra_cols.values():
                    row.append(val[0])

            row2 = [(None if v == '' else v) for v in row]

            batch.append(row2)
            if len(batch) >= batch_size:
                cursor.executemany(insert_sql, batch)
                conn.commit()
                pbar.update(len(batch))
                batch = []

        if batch:
            cursor.executemany(insert_sql, batch)
            conn.commit()
            pbar.update(len(batch))

    conn.close()
    print(f"✔ Imported {txt_file} → table '{table_name}'")

def update_allCountries_from_txt(txt_file, sqlite_db, column_name="admin5_code"):
    conn = sqlite3.connect(sqlite_db)
    cursor = conn.cursor()

    cursor.execute(f"PRAGMA table_info(allCountries);")
    columns = [info[1] for info in cursor.fetchall()]
    if column_name not in columns:
        cursor.execute(f"ALTER TABLE allCountries ADD COLUMN {column_name} VARCHAR(20);")
        conn.commit()
        print(f"✔ Added column '{column_name}' to allCountries")

    with open(txt_file, "r", encoding="utf-8") as f:
        total_lines = sum(1 for line in f if not line.startswith("#"))

    batch_size = 1000
    batch = []

    with open(txt_file, "r", encoding="utf-8") as f, tqdm(total=total_lines, desc=f"Updating {column_name}", unit="rows") as pbar:
        reader = csv.reader(f, delimiter="\t")
        for row in reader:
            if not row or row[0].startswith("#"):
                continue

            geoname_id = row[0]
            value = row[1] if len(row) > 1 else None
            batch.append((value, geoname_id))

            if len(batch) >= batch_size:
                cursor.executemany(f"UPDATE allCountries SET {column_name} = ? WHERE geoname_id = ?", batch)
                conn.commit()
                pbar.update(len(batch))
                batch = []

        if batch:
            cursor.executemany(f"UPDATE allCountries SET {column_name} = ? WHERE geoname_id = ?", batch)
            conn.commit()
            pbar.update(len(batch))

    conn.close()
    print(f"✔ Finished updating '{column_name}' in allCountries from {txt_file}")

def main():
    parser = argparse.ArgumentParser(
        description="Import GeoNames .txt files into SQLite using .schema files, merge featureCodes, update allCountries, and skip headers in specific files."
    )
    parser.add_argument("txt_dir", nargs="?", default="txt", help="Directory containing .txt files")
    parser.add_argument("schema_dir", nargs="?", default="schemas", help="Directory containing .schema files")
    parser.add_argument("sqlite_db", nargs="?", default="db/database.sqlite", help="Output SQLite database file (default: database.sqlite)")
    args = parser.parse_args()

    txt_dir = args.txt_dir
    schema_dir = args.schema_dir
    sqlite_db = args.sqlite_db

    if not os.path.isdir(txt_dir) or not os.path.isdir(schema_dir):
        print("Error: txt_dir or schema_dir does not exist or is not a directory.")
        return

    print("Converting geonames.org tab-separated text files to Sqlite database...")

    # Create the database directory if it doesn't exist
    sqlite_db_dir = os.path.dirname(sqlite_db)
    if not os.path.exists(sqlite_db_dir):
        os.makedirs(sqlite_db_dir)

    maxInt = sys.maxsize
    while True:
        # decrease the maxInt value by factor 10 
        # as long as the OverflowError occurs.
        try:
            csv.field_size_limit(maxInt)
            break
        except OverflowError:
            maxInt = int(maxInt/10)

    skip_first_row_files = {"iso-languagecodes.txt", "shapes_all_low.txt", "timeZones.txt"}
    txt_files = [f for f in os.listdir(txt_dir) if f.endswith(".txt")]

    # 1️⃣ Import allCountries first
    if "allCountries.txt" in txt_files:
        table_name = "allCountries"
        schema_file = os.path.join(schema_dir, "allCountries.schema")
        insert_txt_file(os.path.join(txt_dir, "allCountries.txt"), table_name, schema_file, sqlite_db, skip_first_row_files=skip_first_row_files)
        txt_files.remove("allCountries.txt")

    # 2️⃣ Update allCountries from adminCode5
    if "adminCode5.txt" in txt_files:
        update_allCountries_from_txt(os.path.join(txt_dir, "adminCode5.txt"), sqlite_db)
        txt_files.remove("adminCode5.txt")

    # 3️⃣ Import featureCodes_XX.txt
    feature_codes_pattern = re.compile(r'^featureCodes_(\w{2})\.txt$')
    for f in sorted(txt_files):
        match = feature_codes_pattern.match(f)
        if match:
            lang = match.group(1)
            feature_schema_file = os.path.join(schema_dir, "featureCodes.schema")
            insert_txt_file(
                os.path.join(txt_dir, f),
                table_name="featureCodes",
                schema_file=feature_schema_file,
                sqlite_db=sqlite_db,
                extra_cols={"language": (lang, "CHAR(2)")},
                skip_first_row_files=skip_first_row_files
            )
            txt_files.remove(f)

    # 4️⃣ Import remaining regular tables
    for f in sorted(txt_files):
        table_name = os.path.splitext(f)[0]
        schema_file = os.path.join(schema_dir, f"{table_name}.schema")
        insert_txt_file(
            os.path.join(txt_dir, f),
            table_name=table_name,
            schema_file=schema_file,
            sqlite_db=sqlite_db,
            skip_first_row_files=skip_first_row_files
        )

    # 5️⃣ Remove redundant data and VACUUM the database to optimize size
    print("🧹 Optimizing database...")
    conn = sqlite3.connect(sqlite_db)
    conn.execute("UPDATE admin1CodesASCII SET ascii_name = NULL WHERE ascii_name = name;")
    conn.execute("UPDATE admin2Codes SET ascii_name = NULL WHERE ascii_name = name;")
    conn.execute("ALTER TABLE allCountries DROP COLUMN alternate_names;")
    conn.execute("UPDATE allCountries SET ascii_name = NULL WHERE ascii_name = name;")
    conn.execute("CREATE TABLE featureCodes_en(fc TEXT PRIMARY KEY, name TEXT, description TEXT);");
    conn.execute("INSERT INTO featureCodes_en SELECT feature_code, name, description FROM featureCodes WHERE language = 'en';");
    conn.execute("""
                  UPDATE featureCodes SET name = NULL
                  WHERE EXISTS (
                      SELECT fc FROM featureCodes_en
                      WHERE featureCodes.feature_code = featureCodes_en.fc
                      AND featureCodes.name = featureCodes_en.name
                  ) AND language != "en";
    """);
    conn.execute("""
                  UPDATE featureCodes SET description = NULL
                  WHERE EXISTS (
                      SELECT fc FROM featureCodes_en
                      WHERE featureCodes.feature_code = featureCodes_en.fc
                      AND featureCodes.description = featureCodes_en.description
                  ) AND language != "en";
    """);
    conn.execute("DROP TABLE featureCodes_en;");
    conn.execute("DELETE FROM featureCodes WHERE name IS NULL AND description IS NULL;");
    conn.commit()

    conn = sqlite3.connect(sqlite_db)
    conn.execute("VACUUM;")
    conn.close()
    print("✔ Database optimization complete.")

if __name__ == "__main__":
    main()
