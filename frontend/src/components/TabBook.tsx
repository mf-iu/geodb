import React from "react";

import Box     from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tab     from "@mui/material/Tab";
import Tabs    from "@mui/material/Tabs";

import CountryInformation from "./CountryInformation";
import SqlCommands        from "./SqlCommands";
import SqlQuery           from "./SqlQuery";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function TabBook() {
    const [tabIndex, setTabIndex] = React.useState(0);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return (
        <Box sx={{ display: "flex" }}>
            <Tabs orientation="vertical"
                  value={tabIndex}
                  onChange={(_, newValue) => setTabIndex(newValue)}
                  sx={{ borderRight: 1, borderColor: "divider", minWidth: 120 }}
            >
                <Tab label="SQL Query" />
                <Tab label="SQL Commands" />
                <Divider />
                <Tab label="Country Info" />
            </Tabs>

            <Box sx={{ flexGrow: 1, p: 1 }}>
                {tabIndex === 0 && <SqlQuery />}
                {tabIndex === 1 && <SqlCommands />}
                {tabIndex === 3 && <CountryInformation />}
            </Box>
        </Box>
    );
}
