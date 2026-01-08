import { initializeDatabase  } from "./database";
import { openDatabase        } from "./database";
import { runSqlCommandsAsync } from "./database";
import { runSqlQueryAsync    } from "./database";

import cors    from "cors";
import express from "express";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// let databasePromise = initializeDatabase();
let databasePromise = openDatabase("./database.sqlite");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

app.get(
    "/",
    async (request, response) => {
        try {
            response.send("Backend is running.");
        } catch (err) {
            response.status(500).json({ error: (err as Error).message });
        }
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

app.post(
    "/execute-sql-commands",
    async (request, response) => {
        const { sql } = request.body as { sql?: string };

        if (!sql)
            return response.status(400).json({ error: "SQL commands required" });

        try {
            const database = await databasePromise;

            const result = await runSqlCommandsAsync(database, sql);
            response.json({ message: "Success.", ...result });
        } catch (err) {
            response.status(500).json({ error: (err as Error).message });
        }
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

app.post(
    "/execute-sql-query",
    async (request, response) => {
        const { sql, parameters } = request.body as { sql?: string; parameters?: unknown[] };

        if (!sql)
            return response.status(400).json({ error: "SQL query required" });

        try {
            const database = await databasePromise;

            const result = await runSqlQueryAsync(database, sql, parameters || []);
            response.json(result);
        } catch (err) {
            response.status(500).json({ error: (err as Error).message });
        }
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

app.listen(
    PORT,
    () => console.log(`Backend running on http://localhost:${PORT}`)
);
