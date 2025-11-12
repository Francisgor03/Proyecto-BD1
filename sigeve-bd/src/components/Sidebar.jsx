import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const menu = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Ordenes', icon: <PeopleIcon />, path: '/orders' },
  { text: 'Productos', icon: <PeopleIcon />, path: '/products' },
  { text: 'Proveedores', icon: <PeopleIcon />, path: '/suppliers' },
  { text: 'Categorías', icon: <PeopleIcon />, path: '/categories' },
  { text: 'Remitentes', icon: <PeopleIcon />, path: '/shippers' },
  { text: 'Regiones', icon: <PeopleIcon />, path: '/region' },
  { text: 'Territorios', icon: <PeopleIcon />, path: '/territories' }
];


  return (
    <Box
      sx={{
        width: 220,
        backgroundColor: '#1976d2',
        color: '#fff',
        p: 2
      }}
    >
      <h3 style={{ margin: '0 0 20px 10px' }}>SIGEVE</h3>
      <List>
        {menu.map(item => (
          <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
