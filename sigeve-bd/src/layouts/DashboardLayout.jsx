import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/NavBar';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh',minWidth: '100vw' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9f9f9' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
