import Container  from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import MainMenuBar from "./components/MainMenuBar";
import TabBook     from "./components/TabBook";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function App() {
    return (
        <Container maxWidth={true} sx={{ mt: 4 }}>
            <MainMenuBar />

            <TabBook />
        </Container>
    );
}
