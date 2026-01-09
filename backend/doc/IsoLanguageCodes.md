# ISO Language Codes

ISO-Codes der Sprachfamilien, Sprachen bzw. Dialekte der Welt inkl. historischer Sprachen u. a.


## Schema

Tabelle **iso_languagecodes**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **iso_639_3** | VARCHAR(20) | | | Code nach [ISO 639-3](https://de.wikipedia.org/wiki/ISO_639#ISO_639-3) |
| **iso_639_2** | VARCHAR(20) | | | Code nach [ISO 639-2](https://de.wikipedia.org/wiki/ISO_639#ISO_639-2) |
| **iso_639_1** | VARCHAR(20) | | | Code nach [ISO 639-1](https://de.wikipedia.org/wiki/ISO_639#ISO_639-1) |
| **name** | VARCHAR(80) | | NOT NULL | Bezeichnung der Sprache/Sprachfamilie bzw. des Dialektes in englisch |

Die alternativen Namen in Tabelle [alternativeNamesV2](AlternativeNames.md) sind mit einem der drei
ISO-Sprachcodes gekennzeichnet.


## Beispiele

| **iso_639_3** | **iso_639_2** | **iso_639_1** | **name** |
| ----------- | ----------- | ----------- | ----------- |
|  | gem |  | Germanic languages |
| deu | deu / ger*  | de | German  |
| gmh | gmh |  | Middle High German (ca. 1050-1500) |
| gml |  |  | Middle Low German |
| gsg |  |  | German Sign Language |
| gsw | gsw |  | Swiss German |
| nds | nds |  | Low German |


