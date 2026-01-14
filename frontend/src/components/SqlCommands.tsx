import React from "react";

import Alert            from "@mui/material/Alert";
import Box              from "@mui/material/Box";
import Button           from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper            from "@mui/material/Paper";
import TextField        from "@mui/material/TextField";
import Typography       from "@mui/material/Typography";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type RowData = Record<string, unknown>;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function SqlCommands() {
    // --- SQL input ---
    const [sql, setSql] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [executionTimeMs, setExecutionTimeMs] = React.useState<number | null>(null);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleSubmit =
        async (e: React.FormEvent) => {
            e.preventDefault();

            setLoading(true);
            setError(null);
            setExecutionTimeMs(null);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300_000); // 5 minutes

            try {
                const response = await fetch(
                    "http://localhost:3000/execute-sql-commands",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sql }),
                        signal: controller.signal,
                    }
                );

                clearTimeout(timeoutId);

                // --- Handle server errors with JSON error property ---
                if (!response.ok) {
                    const json = await response.json();
                    throw new Error(json.error || "Commands failed");
                }

                const result = await response.json();

                setExecutionTimeMs(typeof result.duration === "number" ? result.duration : null);
            }
            catch (err) {
                clearTimeout(timeoutId);
                if ((err as any).name === "AbortError") {
                    setError("Request timed out after 5 minutes.");
                }
                else {
                    setError((err as Error).message);
                }
            }
            finally {
                setLoading(false);
            }
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: "90%" }}>
            {/* SQL input */}
            <Box>
                <TextField label="SQL Statements"
                           multiline
                           minRows={15}
                           fullWidth
                           value={sql}
                           onChange={(e) => setSql(e.target.value)}
                           placeholder="CREATE TABLE..."
                           sx={{ mb: 2 }}
                />
            </Box>

            {/* Submit button */}
            <Box>
                <Button type="submit"
                        variant="contained"
                        disabled={loading || !sql.trim()}
                        sx={{ mb: 2 }}
                >
                    Submit
                </Button>
            </Box>

            {/* Loading */}
            {loading && (
                <Box>
                    <CircularProgress sx={{ mb: 2 }} />
                </Box>
            )}

            {/* Error */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Row count & execution time */}
            {executionTimeMs !== null && (
                <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        Success
                        &nbsp;|&nbsp;
                        Execution time:{" "} <strong>{executionTimeMs} ms</strong>
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
