# geodb
Beispielprojekt zum Lernen von SQL


## Einführung

Die Beispielumgebung besteht aus zwei Teilprojekten:

1. **Backend**  
   realisiert einen einfachen REST-Server, der zwei API-Funktionen bereitstellt, um SQL-Kommandos
   bzw. SQL-Abfragen auf einer SQLite-Datenbank auszuführen.

2. **Frontend**  
   realisiert eine einfache React-Anwendung, die es erlaubt, SQL-Befehle einzugeben und an das
   Backend zu senden.
   Die Ergebnisse werden dann als Tabelle in React angezeigt.


## Installation des Backends

Es wird ein lauffähiges NodeJS benötigt: https://nodejs.org/

### Installation der NPM-Pakete

```Batchfile
cd backend
npm install
```

### Download bzw. Erstellung der Beispiel-Datenbank

Es muss noch die Beispieldatenbank über den bekannten Link heruntergeladen werden bzw. mit den
Python-Skripten ```download_geonames.py``` sowie ```convert_to_sqlite.py``` (zu finden in
```backend/download_geonames```) erzeugt werden.

Kopieren Sie die Datenbank ```database.sqlite``` in das Verzeichnis ```backend```.

### Start des Backends

Das Backend kann nun gestartet werden:

```Batchfile
npm run dev
```

Ist der Start erfolgreich, wird folgende Meldung ausgegeben:

```
Backend running on http://localhost:3000
```

Zum Testen kann [http://localhost:3000/](http://localhost:3000/) aufgerufen werden, und die
folgende Ausgabe sollte im Browser ausgegeben werden:


```
Backend is running.
```


## Installation des Frontends

Das Frontend ist ebenfalls eine NodeJS-Anwendung.

### Installation der NPM-Pakete

Öffnen Sie eine neue Konsole und installieren Sie die benötigten NPM-Pakete:

```Batchfile
cd frontend
npm install
```

### Start des Frontends

```Batchfile
npm run dev
```

Ist der Start erfolgreich, wird folgende Meldung angezeigt:

```
VITE v7.3.0  ready in 231 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

Durch Drücken von [o] [Enter] wird [http://localhost:5173/](http://localhost:5173/) aufgerufen
und die Frontend-Applikation gestartet.

