import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/NavBar';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />

      {/* CONTENIDO */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Navbar />

        {/* ÁREA SCROLLEABLE */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            p: 0
          }}
        >
          <div className='app-container'>
            <Outlet />
          </div>
        </Box>
      </Box>
    </Box>
  );
}
