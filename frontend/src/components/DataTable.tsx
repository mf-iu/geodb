import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

type RowData = Record<string, unknown>;
type Order = "asc" | "desc";

export default function DataTable() {
  // --- SQL input ---
  const [sql, setSql] = useState(
    "SELECT * FROM allCountries WHERE country_code = 'DE' AND feature_class = 'P' ORDER BY name LIMIT 10;"
  );
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [truncatedCount, setTruncatedCount] = useState<number | null>(null);

  // --- Sorting & pagination ---
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = useMemo(
    () => (rows.length > 0 ? Object.keys(rows[0]) : []),
    [rows]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setRows([]);
    setExecutionTimeMs(null);
    setTruncatedCount(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300_000); // 5 minutes

    try {
      const response = await fetch("http://localhost:3000/execute-sql-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
        signal: controller.signal,
      });

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
      setOrderBy(Object.keys(data.rows[0] ?? {})[0] ?? "");
      setPage(0);
      setExecutionTimeMs(typeof data.duration === "number" ? data.duration : null);
      setTruncatedCount(typeof data.truncated === "number" ? data.truncated : null);
    } catch (err) {
      clearTimeout(timeoutId);
      if ((err as any).name === "AbortError") {
        setError("Request timed out after 5 minutes.");
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedRows = useMemo<RowData[]>(() => {
    if (!orderBy) return rows;
    return [...rows].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue == null || bValue == null) return 0;
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, order, orderBy]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      {/* SQL input */}
      <TextField
        label="SQL Statement"
        multiline
        minRows={4}
        fullWidth
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        placeholder="SELECT * FROM allCountries LIMIT 10;"
        sx={{ mb: 2 }}
      />

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !sql.trim()}
        sx={{ mb: 2 }}
      >
        Submit
      </Button>

      {/* Loading / error */}
      {loading && <CircularProgress sx={{ mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Row count & execution time */}
      {rows.length > 0 && executionTimeMs !== null && (
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          Rows: <strong>{rows.length}</strong> &nbsp;|&nbsp; Execution time:{" "}
          <strong>{executionTimeMs} ms</strong>
        </Typography>
      )}

      {/* Truncated warning */}
      {truncatedCount !== null && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          Results were truncated from originally {truncatedCount} rows.
        </Alert>
      )}

      {/* Data table */}
      {rows.length > 0 && (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 500, width: "100%" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      sortDirection={orderBy === column ? order : false}
                      sx={{ fontWeight: "bold" }}
                    >
                      <TableSortLabel
                        active={orderBy === column}
                        direction={orderBy === column ? order : "asc"}
                        onClick={() => handleSort(column)}
                      >
                        {column}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.map((row, rowIndex) => (
                  <TableRow hover key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {String(row[column] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}
    </Box>
  );
}
