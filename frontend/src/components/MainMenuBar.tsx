import AppBar     from '@mui/material/AppBar';
import Box        from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link       from '@mui/material/Link';
import MenuIcon   from '@mui/icons-material/Menu';
import Toolbar    from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function MainMenuBar() {
    return (
        <Box sx={{ mb: 2, flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ mr: 3, flexGrow: 1 }}>
                        Geonames SQL Learning Frontend
                    </Typography>

                    <Link href="https://github.com/mf-iu/geodb.git" target="_blank" color="inherit" underline="hover" sx={{ mr: 3 }}>
                        GitHub
                    </Link>

                    <Link href="https://sqlite.org/lang.html" target="_blank" color="inherit" underline="hover" sx={{ mr: 3 }}>
                        SQLite SQL
                    </Link>

                    <Link href="https://www.w3schools.com/sql/" target="_blank" color="inherit" underline="hover">
                        SQL Tutorial
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
