import sqlite3 from 'sqlite3';

import { performance } from 'perf_hooks';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const timeout_ms = 60 * 1000; // one minute

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type SqlCommandsResult = {
    duration: number
};

// Helper to run the SQL commands and return the number of changes.
export function runSqlCommandsAsync(database: sqlite3.Database,
                                    sql: string): Promise<SqlCommandsResult> {
    let timer: NodeJS.Timeout;

    return new Promise<SqlCommandsResult>(
        (resolve, reject) => {
            const startTime = performance.now();

            timer = setTimeout(
                () => {
                    database.interrupt();
                    reject(new Error(`SQLite command timed out after ${timeout_ms} ms`));
                },
                timeout_ms
            );

            // Execute the SQL commands on the database
            database.exec(
                sql,
                function (err) {
                    clearTimeout(timer);

                    // Let the promise fail in case of an error.
                    if (err)
                        reject(err);

                    const duration_ms = performance.now() - startTime;

                    // On success, return the changes and the duration of execution.
                    resolve({ duration: duration_ms });
                }
            );
        }
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type SqlQueryResult<T> = {
    rows: T[],
    duration: number,
};

// Helper to run an SQL query and return all rows.
export function runSqlQueryAsync<T = any>(database: sqlite3.Database,
                                          sql: string,
                                          params: any[] = []): Promise<SqlQueryResult<T>> {
    let timer: NodeJS.Timeout;

    return new Promise<SqlQueryResult<T>>(
        (resolve, reject) => {
            const startTime = performance.now();

            timer = setTimeout(
                () => {
                    database.interrupt();
                    reject(new Error(`SQLite query timed out after ${timeout_ms} ms`));
                },
                timeout_ms
            );

            // Execute the SQL command on the database
            database.all(
                sql,
                params,
                (err, rows) => {
                    clearTimeout(timer);

                    // Let the promise fail in case of an error.
                    if (err)
                        reject(err);

                    const duration_ms = performance.now() - startTime;

                    // On success, return the resulting rows and the duration of execution.
                    resolve({ rows: rows as T[], duration: duration_ms });
                }
            );
        }
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Open database.
export async function openDatabase(filename: string): Promise<sqlite3.Database> {
    return new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_FULLMUTEX);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Initialize the database with example rows
export async function initializeDatabase(): Promise<sqlite3.Database> {
    const database = new sqlite3.Database(':memory:');

    // Use serialize to run queries in order
    database.serialize(
        () => {
            database.run(`
                CREATE TABLE IF NOT EXISTS
                    items(id INTEGER PRIMARY KEY,
                          name TEXT);
            `);

            database.run(`INSERT INTO items (name) VALUES (?);`, ['Item 1']);
            database.run(`INSERT INTO items (name) VALUES (?);`, ['Item 2']);
        }
    );

    return database;
}
