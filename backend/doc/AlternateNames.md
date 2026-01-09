# Alternate Names

Alternative Namen der Geoname-Objekte sowie Namen in Landessprachen

## Schema

Tabelle **alternateNamesV2**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
|----------- | ----------- | ----------- | ----------- | ----------- |
| **alternate_name_id** | INTEGER | PRIMARY KEY | NOT NULL | Numerische ID des alternativen Namens |
| **geoname_id** | INTEGER | | NOT NULL | Geoname-ID des Objekts, für das der alternative Name zugewiesen wird; verweist auf Tabelle [allCountries](AllCountries.md) |
| **iso_language** | VARCHAR(7) | | | Sprachcode nach ISO 639 (2 oder 3 Zeichen), optional gefolgt von Bindestrich und länderspezifischer Variante (z. B. de-DE) bzw. Variantenname (z. B. zh-Hant); Alternativ: 4-characters 'post' for postal codes and 'iata', 'icao' and 'faac' for airport codes, 'fr_1793' for French Revolution names, 'abbr' for abbreviation, link to a website (mostly to Wikipedia), 'wkdt' for the wikidataid |
| **alternate_name** | VARCHAR(400) | | | Alternativer Name (UTF-8) |
| **is_preferred_name** | BOOLEAN | | | 1, falls der alternative Name der offizielle/präferierte Name ist (z. B. 'Bundesrepublik Deutschland') |
| **is_short_name** | BOOLEAN | | | 1, falls der alternatve Name ein Kurzname ist (z. B. 'Germany' für 'Federal Republic of Germany') |
| **is_colloquial** | BOOLEAN | | | 1, falls der alternative Name ein informeller oder Slang-Name ist (z. B. 'Big Apple' für 'New York')|
| **is_historic** | BOOLEAN | | | 1, falls der alternative Name ein historischer Name ist (z. B. 'Karl-Marx-Stadt' für 'Chemnitz') |
| **historic_from** | VARCHAR(10) | | | Datumsangabe für den Beginn der Gültigkeit eines historischen Namens |
| **historic_to** | VARCHAR(10) | | | Datumsangabe für das Ende der Gültigkeit eines historischen Namens |


## Beispiele


| **alternate_name_id** | **geoname_id** | **iso_language** | **alternate_name** | **is_preferred_name** | **is_short_name** | **is_colloquial** | **is_historic** | **historic_from** | **historic_to** |
|-----------: | -----------: | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| 1269404 | 2940132 |  | Karl-Marx-Stadt |  |  |  | 1 | 1953 | 1990 |
| 2080248 | 2953481 | de | Baden-Württemberg | 1 | 1 |  |  |  |  |
| 2080249 | 2953481 | es | Baden-Wurtemberg | 1 |  |  |  |  |  |
| 2185037 | 2953481 |  | Baden-Württemberg | 1 | 1 |  |  |  |  |
| 2254544 | 2953481 | fr | Bade-Wurtemberg | 1 | 1 |  |  |  |  |
| 2254559 | 2953481 | fr | Pays de Bade |  |  |  |  |  |  |
| 2426269 | 2953481 | en | Baden-Wurttemberg Region |  |  |  |  |  |  |
| 5423911 | 2953481 | link | [](https://en.wikipedia.org/wiki/Baden-W%C3%BCrttemberg) |  |  |  |  |  |  |
| 5882249 | 2953481 | fa | بادن-وورتم‌برگ |  |  |  |  |  |  |
| 5882250 | 2953481 | stq | Baden-Würtembierich |  |  |  |  |  |  |
| 5882251 | 2953481 | la | Badenia et Virtembergia |  |  |  |  |  |  |
| 5882252 | 2953481 | fy | Baden-Wúrtemberch |  |  |  |  |  |  |
| 5882253 | 2953481 | dsb | Baden-Württembergska |  |  |  |  |  |  |
| 5882254 | 2953481 | az | Baden-Vürtemberq |  |  |  |  |  |  |
| 5882255 | 2953481 | he | באדן-וירטמברג |  |  |  |  |  |  |
| 5882256 | 2953481 | bar | Bodn-Wiattmbeag |  |  |  |  |  |  |
| 5882257 | 2953481 | th | รัฐบาเดิน-เวือร์ทเทิมแบร์ค |  |  |  |  |  |  |
| 5882258 | 2953481 | ar | بادن-فورتمبيرغ |  |  |  |  |  |  |
| 5882259 | 2953481 | zh | 巴登-符腾堡 |  |  |  |  |  |  |
| 5882260 | 2953481 | mr | बाडेन-व्युर्टेंबर्ग |  |  |  |  |  |  |
