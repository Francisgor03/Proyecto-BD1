import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
        boxShadow: 'var(--card-shadow)',
        borderBottom: '1px solid rgba(0,0,0,0.04)'
      }}
    >
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 700 }}>
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
