import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import DataTable from "./DataTable";

export default function TabBook() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Tabs
        orientation="vertical"
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        sx={{
          borderRight: 1,
          borderColor: "divider",
          minWidth: 120,
        }}
      >
        <Tab label="SQL Query" />
      </Tabs>

      <Box sx={{ flexGrow: 1, p: 1 }}>
        {tabIndex === 0 && <DataTable />}
      </Box>
    </Box>
  );
}
