import React from "react";

import Box            from "@mui/material/Box";
import Paper          from "@mui/material/Paper";
import Stack          from "@mui/material/Stack";
import Table          from "@mui/material/Table";
import TableBody      from "@mui/material/TableBody";
import TableCell      from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow       from "@mui/material/TableRow";

import useQuery from "../hooks/useQuery";

import SelectCountry from "./SelectCountry";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function CountryInformation() {
    const [geonameId, setGeonameId] = React.useState<number | null>(null); // Germany

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // --- Run the SQL query on submit ---
    const { result, run } = useQuery();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleChangeGeonameId = (geonameId: number | null) => {
        setGeonameId(geonameId);

        const sqlQuery = `SELECT * FROM countryInfo WHERE geoname_id = ${geonameId};`;

        run(sqlQuery);
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const columns = React.useMemo(
        () => (result.data?.rows.length > 0 ? Object.keys(result.data.rows[0]) : []),
        [result]
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return (
        <Stack spacing={2}>
            <SelectCountry geonameId={geonameId} handleChangeGeonameId={handleChangeGeonameId} />

            {(result.data?.rows?.length > 0) && (
                <TableContainer component={Paper}>
                    <Table size="small" sx={{ width: "auto" }}>
                        <TableBody>
                            {Object.keys(result.data.rows[0]).map(
                                (attribute, attributeIdx) => (
                                    <TableRow hover key={attributeIdx}>
                                        <TableCell key={0} sx={{ fontWeight: "bold" }}>
                                            {attribute}
                                        </TableCell>
                                        {(result.data.rows[0][attribute] === null || result.data.rows[0][attribute] === undefined)
                                            ? (
                                                <TableCell key={1} sx={{ backgroundColor: "#ffeeee" }}>
                                                    {String("")}
                                                </TableCell>
                                            )
                                            : (
                                                <TableCell key={1}>
                                                    {String(result.data.rows[0][attribute] ?? "")}
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Stack>
    );
}
