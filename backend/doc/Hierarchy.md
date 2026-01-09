# Hierarchy

Zuordnung von untergeordenten Geoname-Objekten zu übergeordneten Geoname-Objekten

Die Hierarchie ist keine Baumstruktur, sondern ein Graph, d. h., ein Objekt kann mehrere
Elternobjekte haben (eventuell durch das **type**-Attribut genauer definiert).  
Die Semantik der Eltern-Kind-Beziehung ergibt sich implizit aus den
[Feature-Klassen und -Codes](https://www.geonames.org/export/codes.html)
der beteiligten Geoname-Objekte.


## Schema

Tabelle **hierarchy**

| **Attribut** | **Typ** | **Schlüssel** | **Constraints** | **Beschreibung** |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| **parent_geoname_id** | INTEGER | | NOT NULL | Numerische ID des übergeordneten Geoname-Objekts, verweist auf Tabelle [allCountries](AllCountries.md) |
| **child_geoname_id** | INTEGER | | NOT NULL | Numerische ID des untergeordneten Geoname-Objekts, verweist auf Tabelle [allCountries](AllCountries.md) |
| **type** | VARCHAR(80) | | | Typ der Beziehung: 'ADM' für die administrative Gliederung entsprechend der Attribute **admin1_code** bis **admin5_code** in Tabelle [allCountries](AllCountries.md); länderspezifische Typen sind möglich; Typ kann auch undefiniert sein. |

Die ADM-Hierarchie ist nicht für alle Objekte in der Tabelle enthalten.
Sie muss über die Attribute **admin1_code** bis **admin5_code** in Tabelle
[allCountries](AllCountries.md) rekonstruiert werden.

## Beispiele

Alle untergeordneten Einheiten der Stadt [Chemnitz](https://www.geonames.org/2940132/chemnitz.html):

| **parent_geoname_id** | **child_geoname_id** | **type** | Erklärung |
| -----------: | -----------: | ----------- | ----------- |
| 2940132 | 2832434 | | Stadtteil: Siegmar |
| 2940132 | 2837047 | | Stadtteil: Schönau |
| 2940132 | 2851180 | | Stadtteil: Rabenstein |
| 2940132 | 2864092 | | Stadtteil: Neustadt (Chemnitz) |
| 2940132 | 2893053 | | Stadtteil: Kappel |
| 2940132 | 6465232 | | Achat Hotel Messe Chemnitz |
| 2940132 | 6470913 | | Residenz Hotel Chemnitz |
| 2940132 | 6475218 | | Renaissance Chemnitz Hotel |
| 2940132 | 6508861 | | Mercure Kongress Chemnitz |

**Hinweis:**
- Die administrative Gliederungsstruktur (Chemnitz | Sachsen | Deutschland) ist **nicht** in der
  Tabelle enthalten.
