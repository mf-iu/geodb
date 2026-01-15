import React from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export type QueryResult = {
    isLoading: boolean;
    data: {
        rows: Record<string, unknown>[];
        truncatedCount: number | null;
        executionTimeMs: number | null;
    } | null;
    error: string | null; // network / parsing / unknown errors
    httpStatus: {
        status: number;
        statusText: string;
    } | null;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function useQuery(): {
    result: QueryResult;
    run: (sqlQuery: string) => void;
} {
    const [result, setResult] = React.useState<QueryResult>({
        isLoading: false,
        data: null,
        error: null,
        httpStatus: null,
    });

    const run = React.useCallback(
        (sqlQuery: string) => {
            if (!sqlQuery) {
                return;
            }

            const controller = new AbortController();

            // pending
            setResult({
                isLoading: true,
                data: null,
                error: null,
                httpStatus: null,
            });

            const timeoutId = setTimeout(() => controller.abort(), 300_000); // 5 minutes

            fetch(
                "http://localhost:3000/execute-sql-query",
                 {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sql: sqlQuery }),
                    signal: controller.signal,
                }
            )
            .then(
                async (response) => {
                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        let body: unknown;

                        try {
                            body = await response.json();
                        } catch {
                            body = undefined;
                        }

                        if (body?.error)
                            setResult({
                                isLoading: false,
                                data: null,
                                error: body.error,
                                httpStatus: null,
                            });
                        else
                            setResult({
                                isLoading: false,
                                data: null,
                                error: null,
                                httpStatus: {
                                    status: response.status,
                                    statusText: response.statusText,
                                },
                            });

                        return;
                    }

                    const data = await response.json();

                    // Expecting { rows: [...], duration: number, truncated?: number }
                    if (!data || !Array.isArray(data.rows)) {
                        setResult({
                            isLoading: false,
                            data: null,
                            error: "Invalid API response",
                            httpStatus: {
                                status: response.status,
                                statusText: response.statusText,
                            },
                        });
                    }
                    else {
                        setResult({
                            isLoading: false,
                            data: {
                                rows: data.rows as Record<string, unknown>[],
                                truncatedCount: typeof data.truncated === "number" ? data.truncated : null,
                                executionTimeMs: typeof data.duration === "number" ? data.duration : null,
                            },
                            error: null,
                            httpStatus: null,
                        });
                        
                    }
                }
            )
            .catch(
                (err: unknown) => {
                    clearTimeout(timeoutId);

                    if (err instanceof DOMException &&err.name === "AbortError") {
                        setResult({
                            isLoading: false,
                            data: null,
                            error: "Request timed out...",
                            httpStatus: null,
                        });
                    }
                    else {
                        setResult({
                            isLoading: false,
                            data: null,
                            error: err instanceof Error ? err.message : "Unknown error",
                            httpStatus: null,
                        });
                    }
                }
            );

            return () => controller.abort();
        },
        []
    );

    return { result, run };
}
