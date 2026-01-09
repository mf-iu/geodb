# User Tags

Benutzerspezifische Tags


## Schema

Tabelle **userTags**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **geoname_id** | INTEGER | | NOT NULL | Geoname-ID des Objekts, für das das Tag zugewiesen wird; verweist auf Tabelle [allCountries](AllCountries.md) |
| **tag** | VARCHAR(80) | | | Benutzerspezifisches Tag |

Einem Objekt können mehrere Tags zugewiesen werden.


## Beispiele

| **geoname_id** | **tag** |
| -----------: | ----------- |
| 2599253 | opengeodb |
| 6359495 | place |
| 6194228 | KR |
| 6194228 | airports |
| 2659471 | Kantone_CH |
| 6955487 | Heritage |
