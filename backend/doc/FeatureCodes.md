# Feature Codes

Namen und Beschreibungen der Feature-Klassen und Feature-Codes in verschiedenen Sprachen


## Schema

Tabelle **featureCodes**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **feature_code** | VARCHAR(80) | | NOT NULL | Feature-Code (zusammengesetzt aus Feature-Klasse, Punkt und Feature-Code; siehe auch [Geonames Feature Codes](https://www.geonames.org/export/codes.html) |
| **name** | VARCHAR(200) | | | Bezeichnung des Features |
| **description** | VARCHAR(200) | | | Beschreibung (NULL, falls identisch mit **name** oder falls nicht übersetzt) |
| **language** | CHAR(2) | | | Code der Sprache |


## Beispiele

| **feature_code** | **name** | **description** | **language** |
| ----------- | ----------- | ----------- | ----------- |
| A.ADM1 | first-order administrative division | a primary administrative division of a country, such as a state in the United States | en |
| A.ADM2 | second-order administrative division | a subdivision of a first-order administrative division | en |
| A.ADM3 | third-order administrative division | a subdivision of a second-order administrative division | en |
| A.ADM4 | fourth-order administrative division | a subdivision of a third-order administrative division | en |
| A.ADM1 | първостепенна административна единица  |  | bg |
| A.ADM2 | второстепенна административна единица  |  | bg |
| A.ADM3 | третостепенна административна единица  |  | bg |
| A.ADM4 | четвъртостепенна административна единица  |  | bg |
| A.ADM1 | политико-административное деление первого порядка | первоначальное политико-административное  деление, например, деление США на штаты | ru |
| A.ADM2 | политико-административное деление второго порядка | дальнейшее деление политико-административного деления первого порядка | ru |
| A.ADM3 | политико-административное деление третьего порядка | дальнейшее деление политико-административного деления второго порядка | ru |
| A.ADM4 | политико-административное деление четвертого порядка | дальнейшее деление политико-административного деления третьего порядка | ru |
