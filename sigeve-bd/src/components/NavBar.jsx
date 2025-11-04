import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  return (
    <AppBar position='static' color='inherit' elevation={1}>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Panel Administrativo
        </Typography>
        <Box>
          <IconButton color='inherit'>
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
