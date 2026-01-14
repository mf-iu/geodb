import Container  from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import TabBook from "./components/TabBook";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function App() {
    return (
        <Container maxWidth={true} sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Geonames SQL Learning Frontend
            </Typography>

            <TabBook />
        </Container>
    );
}
