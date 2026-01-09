# Admin Codes

Namen der administrativen Einheiten

## Schema

Tabellen **admin1CodesASCII** und **admin2Codes**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **code** | VARCHAR(80) | PRIMARY KEY | NOT NULL | Länderspezifischer Code der administrativen Einheit |
| **name** | VARCHAR(200) | | NOT NULL | Name der administrativen Einheit in englisch oder in Landessprache (UTF-8) |
| **ascii_name** | VARCHAR(200) |  | | Name in 7-Bit-ASCII; NULL falls identisch mit **name** |
| **geoname_id** | INTEGER | | UNIQUE, NOT NULL | Numerische ID der administrativen Einheit, verweist auf Tabelle [allCountries](AllCountries.md) |


## Beispiele

### Tabelle admin1CodesASCII

| **code** | **name** | **ascii_name** | **geoname_id** |
| ----------- | ----------- | ----------- | -----------: |
| DE.01 | Baden-Wurttemberg | Baden-Wurttemberg | 2953481 |
| DE.02 | Bavaria | Bavaria | 2951839 |
| DE.03 | City state Bremen | City state Bremen | 2944387 |
| DE.04 | Hamburg | Hamburg | 2911297 |
| DE.05 | Hesse | Hesse | 2905330 |
| DE.06 | Lower Saxony | Lower Saxony | 2862926 |
| DE.07 | North Rhine-Westphalia | North Rhine-Westphalia | 2861876 |
| DE.08 | Rheinland-Pfalz | Rheinland-Pfalz | 2847618 |
| DE.09 | Saarland | Saarland | 2842635 |
| DE.10 | Schleswig-Holstein | Schleswig-Holstein | 2838632 |
| DE.11 | Brandenburg | Brandenburg | 2945356 |
| DE.12 | Mecklenburg-Vorpommern | Mecklenburg-Vorpommern | 2872567 |
| DE.13 | Saxony | Saxony | 2842566 |
| DE.14 | Saxony-Anhalt | Saxony-Anhalt | 2842565 |
| DE.15 | Thuringia | Thuringia | 2822542 |
| DE.16 | State of Berlin | State of Berlin | 2950157 |


### Tabelle admin2Codes

| **code** | **name** | **ascii_name** | **geoname_id** |
| ----------- | ----------- | ----------- | -----------: |
| DE.02.091 | Upper Bavaria | Upper Bavaria | 2861322 |
| DE.02.092 | Lower Bavaria | Lower Bavaria | 2863622 |
| DE.02.093 | Upper Palatinate | Upper Palatinate | 2859444 |
| DE.02.094 | Upper Franconia | Upper Franconia | 2860681 |
| DE.02.095 | Regierungsbezirk Mittelfranken | Regierungsbezirk Mittelfranken | 2870736 |
| DE.02.096 | Regierungsbezirk Unterfranken | Regierungsbezirk Unterfranken | 2819564 |
| DE.02.097 | Swabia | Swabia | 2835521 |


