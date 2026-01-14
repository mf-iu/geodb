import React from "react";

import Alert            from "@mui/material/Alert";
import Box              from "@mui/material/Box";
import Button           from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper            from "@mui/material/Paper";
import Table            from "@mui/material/Table";
import TableBody        from "@mui/material/TableBody";
import TableCell        from "@mui/material/TableCell";
import TableContainer   from "@mui/material/TableContainer";
import TableHead        from "@mui/material/TableHead";
import TablePagination  from "@mui/material/TablePagination";
import TableRow         from "@mui/material/TableRow";
import TextField        from "@mui/material/TextField";
import Typography       from "@mui/material/Typography";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type RowData = Record<string, unknown>;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function DataTable() {
    // --- SQL input ---
    const [sql, setSql] = React.useState(
        "SELECT * FROM allCountries WHERE country_code = 'DE' AND feature_class = 'P' ORDER BY name LIMIT 10;"
    );
    const [rows, setRows] = React.useState<RowData[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [executionTimeMs, setExecutionTimeMs] = React.useState<number | null>(null);
    const [truncatedCount, setTruncatedCount] = React.useState<number | null>(null);

    // --- Sorting & pagination ---
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const columns = React.useMemo(
        () => (rows.length > 0 ? Object.keys(rows[0]) : []),
        [rows]
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleSubmit =
        async (e: React.FormEvent) => {
            e.preventDefault();

            setLoading(true);
            setError(null);
            setRows([]);
            setExecutionTimeMs(null);
            setTruncatedCount(null);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300_000); // 5 minutes

            try {
                const response = await fetch(
                    "http://localhost:3000/execute-sql-query",
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
                    throw new Error(json.error || "Query failed");
                }

                const data = await response.json();

                // Expecting { rows: [...], duration: number, truncated?: number }
                if (!data || !Array.isArray(data.rows)) {
                    throw new Error("Invalid API response");
                }

                setRows(data.rows);
                setPage(0);
                setExecutionTimeMs(typeof data.duration === "number" ? data.duration : null);
                setTruncatedCount(typeof data.truncated === "number" ? data.truncated : null);
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

    const pagedRows = React.useMemo(
        () => {
            const start = page * rowsPerPage;
            return rows.slice(start, start + rowsPerPage);
        },
        [rows, page, rowsPerPage]
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* SQL input */}
            <Box>
                <TextField label="SQL Statement"
                           multiline
                           minRows={4}
                           fullWidth
                           value={sql}
                           onChange={(e) => setSql(e.target.value)}
                           placeholder="SELECT * FROM allCountries LIMIT 10;"
                           sx={{ mb: 2, maxWidth: "90%" }}
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
            {rows.length >= 0 && executionTimeMs !== null && (
                <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        Rows: <strong>{rows.length}</strong>
                        &nbsp;|&nbsp;
                        Execution time:{" "}
                        <strong>{executionTimeMs} ms</strong>
                    </Typography>
                </Box>
            )}

            {/* Truncated warning */}
            {truncatedCount !== null && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Results were truncated from originally {truncatedCount} rows.
                </Alert>
            )}

            {/* Data table */}
            {rows.length > 0 && (
                <Paper sx={{ width: "90%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 800, width: "100%" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map(
                                        (column) => (
                                            <TableCell key={column} sx={{ fontWeight: "bold" }}>
                                                {column}
                                            </TableCell>
                                        )
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagedRows.map(
                                    (row, rowIndex) => (
                                        <TableRow hover key={rowIndex}>
                                            {columns.map(
                                                (column) => (
                                                    (row[column] === null || row[column] === undefined)
                                                        ? (
                                                            <TableCell key={column} sx={{ backgroundColor: "#ffeeee" }}>
                                                                {String("")}
                                                            </TableCell>
                                                        )
                                                        : (
                                                            <TableCell key={column}>
                                                                {String(row[column] ?? "")}
                                                            </TableCell>
                                                        )
                                                )
                                            )}
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination component="div"
                                     count={rows.length}
                                     page={page}
                                     onPageChange={(_, newPage) => setPage(newPage)}
                                     rowsPerPage={rowsPerPage}
                                     onRowsPerPageChange={
                                         (e) => {
                                             setRowsPerPage(parseInt(e.target.value, 10));
                                             setPage(0);
                                         }
                                     }
                                     rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </Paper>
            )}
        </Box>
    );
}
