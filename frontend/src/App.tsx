import { Container, Typography } from "@mui/material";
import TabBook from "./components/TabBook";

export default function App() {
  return (
    <Container maxWidth={false} sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Geonames SQL Learning Frontend
      </Typography>
      <TabBook />
    </Container>
  );
}
