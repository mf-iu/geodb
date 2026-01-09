# Time Zones

Definition der Zeitzonen der Welt


## Schema

Tabelle **timeZones**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| country_code | CHAR(2) | | | Ländercode (2 Zeichen), siehe Tabelle [countryInfo](CountryInfo.md) |
| timezone_id | VARCHAR(40) | PRIMARY KEY | NOT NULL | IANA ID der Zeitzone |
| gmt_offset | FLOAT | | | Offset in Stunden gegenüber GMT am 1. Januar des aktuellen Jahres (Winterzeit) |
| dst_offset | FLOAT | | | Offset in Stunden gegenüber GMT am 1. Juli des aktuellen Jahres (Sommerzeit) |
| raw_offset | FLOAT | | | Nicht näher spezifizierter Offset in Stunden gegenüber GMT |


## Beispiele

| **country_code** | **timezone_id** | **gmt_offset** | **dst_offset** | **raw_offset** |
| ----------- | ----------- | -----------: | -----------: | -----------: |
| NL | Europe/Amsterdam | 1.0 | 2.0 | 1.0 |
| AD | Europe/Andorra | 1.0 | 2.0 | 1.0 |
| RU | Europe/Astrakhan | 4.0 | 4.0 | 4.0 |
| GR | Europe/Athens | 2.0 | 3.0 | 2.0 |
| RS | Europe/Belgrade | 1.0 | 2.0 | 1.0 |
| DE | Europe/Berlin | 1.0 | 2.0 | 1.0 |
| SK | Europe/Bratislava | 1.0 | 2.0 | 1.0 |
| BE | Europe/Brussels | 1.0 | 2.0 | 1.0 |
| RO | Europe/Bucharest | 2.0 | 3.0 | 2.0 |
| HU | Europe/Budapest | 1.0 | 2.0 | 1.0 |
| DE | Europe/Busingen | 1.0 | 2.0 | 1.0
| MD | Europe/Chisinau | 2.0 | 3.0 | 2.0 |
| DK | Europe/Copenhagen | 1.0 | 2.0 | 1.0 |
| GB | Europe/London | 0.0 | 1.0 | 0.0 |
| US | Pacific/Honolulu | -10.0 | -10.0 | -10.0 |

