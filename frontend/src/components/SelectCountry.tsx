import React from "react";

import Box              from "@mui/material/Box";
import Checkbox         from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl      from "@mui/material/FormControl";
import Divider          from "@mui/material/Divider";
import IconButton       from "@mui/material/IconButton";
import InputLabel       from "@mui/material/InputLabel";
import List             from "@mui/material/List";
import ListItem         from "@mui/material/ListItem";
import ListItemText     from "@mui/material/ListItemText";
import Menu             from "@mui/material/Menu";
import MenuItem         from "@mui/material/MenuItem";
import Select           from "@mui/material/Select";
import Stack            from "@mui/material/Stack";

import FilterListIcon from "@mui/icons-material/FilterList";

import useQuery from "../hooks/useQuery";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const SelectCountry: React.FC = ({ geonameId, handleChangeGeonameId }) => {
    const [selectedGeonameId, setSelectedGeonameId] = React.useState<number | null>(geonameId);

    // States for the config menu
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [continents, setContinents] = React.useState<string[]>(["EU"]);
    const [onlyBigCountries, setOnlyBigCountries] = React.useState<boolean>(true);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // --- Run the SQL query when the configuration changes ---
    const { result, run } = useQuery();

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Fetch data when the component mounts or when continents change
    React.useEffect(
        () => {
            const conditions = [];

            conditions.push(`continent IN (${continents.map((cnt) => (`'${cnt}'`)).join(", ")})`);

            if (onlyBigCountries)
                conditions.push("population >= 1000000");

            const sqlQuery = `SELECT geoname_id, country FROM countryInfo WHERE ${conditions.join(" AND ")} ORDER BY country ASC;`;

            run(sqlQuery);
        },
        [continents, onlyBigCountries]
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleChange =
        (event: React.ChangeEvent<{ value: unknown }>) => {
            const geoname_id = event.target.value as number;
            setSelectedGeonameId(geoname_id);
            handleChangeGeonameId(geoname_id);
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Handle opening and closing of config menu
    const handleClick =
        (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const handleClose =
        () => {
            setAnchorEl(null);
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Handle checkbox toggle
    const handleContinentChange =
        (code: string) => {
            setContinents(
                (prev) =>
                prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
            );
        };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box>
                {/* Filter Icon Button */}
                <IconButton onClick={handleClick} color="primary">
                    <FilterListIcon />
                </IconButton>

                {/* Config Menu with Checkboxes */}
                <Menu anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                >
                    <List>
                        <ListItem>
                            <Checkbox checked={continents.includes("EU")}
                                      onChange={() => handleContinentChange("EU")} />
                            <ListItemText primary="Europe" />
                        </ListItem>
                        <ListItem>
                            <Checkbox checked={continents.includes("AS")}
                                      onChange={() => handleContinentChange("AS")} />
                            <ListItemText primary="Asia" />
                        </ListItem>
                        <ListItem>
                            <Checkbox checked={continents.includes("AF")}
                                      onChange={() => handleContinentChange("AF")} />
                            <ListItemText primary="Africa" />
                        </ListItem>
                        <ListItem>
                            <Checkbox checked={continents.includes("NA")}
                                      onChange={() => handleContinentChange("NA")} />
                            <ListItemText primary="North America" />
                        </ListItem>
                        <ListItem>
                            <Checkbox checked={continents.includes("SA")}
                                      onChange={() => handleContinentChange("SA")} />
                            <ListItemText primary="South America" />
                        </ListItem>
                        <ListItem>
                            <Checkbox checked={continents.includes("OC")}
                                      onChange={() => handleContinentChange("OC")} />
                            <ListItemText primary="Australia and Oceania" />
                        </ListItem>
                        <ListItem>
                            <Checkbox checked={continents.includes("AN")}
                                      onChange={() => handleContinentChange("AN")} />
                            <ListItemText primary="Antarctica" />
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <Checkbox checked={onlyBigCountries}
                                      onChange={(event) => { setOnlyBigCountries(event.target.checked); }} />
                            <ListItemText primary="Only big countries" />
                        </ListItem>
                    </List>
                </Menu>
            </Box>

            {/* ComboBox */}
            <FormControl fullWidth>
                <InputLabel>Choose a Country</InputLabel>

                {result.isLoading
                    ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                            <CircularProgress />
                        </Box>
                      )
                    : (
                        <Select
                        value={selectedGeonameId}
                        onChange={handleChange}
                        label="Choose a Country"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                                {
                                    (result.data?.rows ?? []).map(
                                        (row) => (
                                            <MenuItem key={row.geoname_id} value={row.geoname_id}>
                                                {row.country}
                                            </MenuItem>
                                        )
                                    )
                                }
                        </Select>
                    )
                }
            </FormControl>
        </Stack>
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default SelectCountry;
