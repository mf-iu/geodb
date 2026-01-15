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

import useQuery from "../hooks/useQuery";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

type RowData = Record<string, unknown>;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const defaultSql = "SELECT * FROM allCountries WHERE country_code = 'DE' AND feature_class = 'P' ORDER BY name LIMIT 100;";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function SqlQuery() {
    // --- SQL input ---
    const [sql, setSql] = React.useState(defaultSql);

    // --- Pagination ---
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // --- Run the SQL query on submit ---
    const { result, run } = useQuery();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleSubmit =
        (e: React.FormEvent) => {
            e.preventDefault();
            run(sql);
            setPage(0);
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const columns = React.useMemo(
        () => (result.data?.rows?.length > 0 ? Object.keys(result.data.rows[0]) : []),
        [result]
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const pagedRows = React.useMemo(
        () => {
            const start = page * rowsPerPage;
            return result.data?.rows ? result.data?.rows.slice(start, start + rowsPerPage) : [];
        },
        [result, page, rowsPerPage]
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: "90%" }}>
            {/* SQL input */}
            <Box>
                <TextField label="SQL Statement"
                           multiline
                           minRows={4}
                           fullWidth
                           value={sql}
                           onChange={(event) => setSql(event.target.value)}
                           placeholder={defaultSql}
                           sx={{ mb: 2 }}
                />
            </Box>

            {/* Submit button */}
            <Box>
                <Button type="submit" variant="contained" disabled={result.isLoading || !sql.trim()} sx={{ mb: 2 }}>
                    Submit
                </Button>
            </Box>

            {/* Loading */}
            {result.isLoading && (
                <Box>
                    <CircularProgress sx={{ mb: 2 }} />
                </Box>
            )}

            {/* Error */}
            {result.error !== null && result.error !== undefined && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {result.error}
                </Alert>
            )}
            {/* HTTP Error */}
            {result.httpStatus !== null && result.httpStatus !== undefined && result.httpStatus?.status !== 200 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Request returned with status {result.httpStatus?.status}: {result.httpStatus?.statusText}
                </Alert>
            )}

            {/* Row count & execution time */}
            {result.data?.rows?.length >= 0 && result.data?.executionTimeMs !== null && (
                <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                        Rows: <strong>{result.data.rows.length}</strong>
                        &nbsp;|&nbsp;
                        Execution time:{" "}
                        <strong>{result.data?.executionTimeMs} ms</strong>
                    </Typography>
                </Box>
            )}

            {/* Truncated warning */}
            {result.data?.truncatedCount !== null && result.data?.truncatedCount !== undefined && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                    Results were truncated from originally {result.data?.truncatedCount} rows.
                </Alert>
            )}

            {/* Data table */}
            {(result.data?.rows?.length > 0) && (
                <Paper sx={{ overflow: "hidden" }}>
                    <TableContainer>
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
                                     count={result.data.rows.length}
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
