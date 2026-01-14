# Country Info

Zusätzliche Informationen zu den Staaten der Welt


## Schema

Tabelle **countryInfo**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **iso** | CHAR(2) | | UNIQUE, NOT NULL | ISO-Ländercode (2 Zeichen) |
| **iso3** | CHAR(3) | | UNIQUE, NOT NULL | ISO-Ländercode (3 Zeichen) |
| **iso_numeric** | INTEGER | | UNIQUE, NOT NULL | ISO-Ländercode (numerisch) |
| **fips_code** | VARCHAR(80) | | | FIPS-Code des Landes |
| **country** | VARCHAR(200) | | UNIQUE, NOT NULL | Name des Landes in englisch |
| **capital** | VARCHAR(200) | | | Name der Hauptstadt in englisch |
| **area** | BIGINT | | | Fläche in Quadratkilometern |
| **population** | BIGINT | | | Einwohnerzahl |
| **continent** | CHAR(2) | | | Abkürzung des Kontinents, in dem das Land liegt |
| **tld** | CHAR(2) | | | Internet-Top-Level-Domain (mit vorangestelltem Punkt) |
| **currency_code** | CHAR(3) | | | Währungscode |
| **currency_name** | VARCHAR(200) | | | Name der Währung in englisch |
| **phone** | INTEGER | | | Internationale Telefonvorwahl (ohne vorangestelltes '++') |
| **postal_code_format** | VARCHAR(80) | | | Postleitzahlenformat |
| **postal_code_regex** | VARCHAR(200) | | | Regular Expression zur Validierung einer Postleitzahl |
| **languages** | VARCHAR(80) | | | Gesprochene Sprachen (kommaseparierte Liste) |
| **geoname_id** | INTEGER | PRIMARY KEY | NOT NULL | Geoname-ID des Landes; verweist auf Tabelle [allCountries](AllCountries.md) |
| **neighbours** | VARCHAR(200) | | | Nachbarländer (kommaseparierte Liste von **iso**-Codes) |
| **equivalent_fips_code** | VARCHAR(80) | | | FIPS-Code |


**Hinweise:**
- Der Ländercode für Großbritannien ist 'GB'; der Code 'UK' ist reserviert.


## Beispiele

| **iso** | **iso3** | **iso_numeric** | **fips_code** | **country** | **capital** | **area** | **population** | **continent** | **tld** | **currency_code** | **currency_name** | **phone** | **postal_code_format** | **postal_code_regex** | **languages** | **geoname_id** | **neighbours** | **equivalent_fips_code** |
| ----------- | ----------- | -----------: | ----------- | ----------- | ----------- | -----------: | -----------: | ----------- | ----------- | ----------- | ----------- | -----------: | ----------- | ----------- | ----------- | -----------: | ----------- | ----------- |
| AT | AUT | 040 | AU | Austria | Vienna | 83858 | 8847037 | EU | .at | EUR | Euro | 43 | #### | ^(\d{4})$ | de-AT,hr,hu,sl | 2782113 | CH,DE,HU,SK,CZ,IT,SI,LI |  |
| CH | CHE | 756 | SZ | Switzerland | Bern | 41290 | 8516543 | EU | .ch | CHF | Franc | 41 | #### | ^(\d{4})$ | de-CH,fr-CH,it-CH,rm | 2658434 | DE,IT,LI,FR,AT |  |
| DE | DEU | 276 | GM | Germany | Berlin | 357021 | 82927922 | EU | .de | EUR | Euro | 49 | ##### | ^(\d{5})$ | de | 2921044 | CH,PL,NL,DK,BE,CZ,LU,FR,AT |  |
