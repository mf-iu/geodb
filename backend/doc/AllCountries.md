# All Countries

Haupttabelle mit allen Geoname-Objekten

## Schema

Tabelle **allCountries**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **geoname_id** | INTEGER | PRIMARY KEY | NOT NULL | Numerische ID des Geoname-Objekts |
| **name** | VARCHAR(200) |  | NOT NULL | Name des Geoname-Objekts in englisch oder in Landessprache (UTF-8) |
| **ascii_name** | VARCHAR(200) | | | Name in 7-Bit-ASCII; NULL falls identisch mit **name** |
| **latitude** | DOUBLE | | NOT NULL | Geographische Breite in ° |
| **longitude** | DOUBLE | | NOT NULL | Geographische Länge in ° |
| **feature_class** | CHAR(1) | | | [Geonames Feature Class](https://www.geonames.org/export/codes.html) (A, H, L, ...) des Geoname-Objekts |
| **feature_code** | VARCHAR(10) | | | [Geonames Feature Code](https://www.geonames.org/export/codes.html) unterhalb der Feauture-Klasse |
| **country_code** | CHAR(2) | | | Ländercode nach ISO 3166 |
| **cc2** | VARCHAR(200) | | | Alternative Ländercodes nach ISO 3166 (komma-separierte Liste) |
| **admin1_code** | VARCHAR(20) | | | FIPS-Code der obersten administrativen Einheit, siehe Tabelle [admin1CodesASCII](AdminCodes.md) |
| **admin2_code** | VARCHAR(80) | | | Code der zweithöchsten administrativen Einheit, siehe Tabelle [admin2Codes](AdminCodes.md) |
| **admin3_code** | VARCHAR(20) | | | Code der dritthöchsten administrativen Einheit |
| **admin4_code** | VARCHAR(20) | | | Code der vierthöchsten administrativen Einheit |
| **admin5_code** | VARCHAR(20) | | | Code der fünfthöchsten administrativen Einheit |
| **population** | BIGINT | | | Anzahl der Einwohner |
| **elevation**  | INTEGER | | | Höhe in Metern |
| **dem** | INTEGER | | | Durchschnittliche Höhe gemäß Digital Elevation Model in Metern |
| **timezone_id** | VARCHAR(40) | | | Zeitzone gemäß IANA |
| **modification_date** | DATE | | | Datum der letzten Änderung des Eintrags im Format YYYY-MM-DD |

Hinweise:
- Das Attribut **admin5_code** wurde hinzugefügt (aus Tabelle adminCode5.txt).
- Das Attribut **alternate_names** wurde nicht mit in die Tabelle übertragen.  
  Die alternativen Namen des Geoname-Objekts sind in Tabelle [alternateNamesV2](AlternateNames.md) abgelegt.

## IDs der Kontinente

| **geoname_id** | **name** |
| -----------: | ----------- |
| 6255146 | Africa |
| 6255147 | Asia |
| 6255148 | Europe |
| 6255149 | North America |
| 6255151 | Oceania |
| 6255150 | South America |
| 6255152 | Antarctica |


## Beispiele

| **geoname_id** | **name** | **ascii_name** | **latitude** | **longitude** | **feature_class** | **feature_code** | **country_code** | **cc2** | **admin1_code** | **admin2_code** | **admin3_code** | **admin4_code** | **admin5_code** | **population** | **elevation** | **dem** | **timezone_id** | **modification_date** |
| -----------: | ----------- | ----------- | -----------: | -----------: | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | -----------: | -----------: | -----------: | ----------- | ----------- |
| 6255148 | Europe | | 48.69096 | 9.14062 | L | CONT |  | AD,AL,AT,AX,BA,BE,BG,BY,CH,CZ,DE,DK,EE,ES,FI,FO,FR,GB,GG,GI,GR,HR,HU,IE,IM,IS,IT,JE,LI,LT,LU,LV,MC,MD,ME,MK,MT,NL,NO,PL,PT,RO,RS,RU,SE,SI,SJ,SK,SM,UA,VA |  |  |  |  |  | 741000000 |  | 443 | Europe/Vaduz | 2024-06-20 |
| 2921044 | Federal Republic of Germany | | 51.50000 | 10.50000 | A | PCLI | DE |  | 00 |  |  |  |  | 82927922 |  | 303 | Europe/Berlin | 2024-11-04 |
| 2953481 | Baden-Württemberg | Baden-Wuerttemberg | 48.50000 | 9.00000 | A | ADM1 | DE |  | 01 |  |  |  |  | 11111496 |  | 327 | Europe/Berlin | 2022-12-26 |
| 2951839 | Bavaria |  | 49.00000 | 11.50000 | A | ADM1 | DE |  | 02 |  |  |  |  | 13124737 |  | 503 | Europe/Berlin | 2022-12-26 |
| 2940132 | Chemnitz | Chemnitz | 50.8357 | 12.92922 | P | PPLA3 | DE |  | 13 | 00 | 14511 | 14511000 |  | 247220 |  | 306 | Europe/Berlin | 2021-06-21 |
