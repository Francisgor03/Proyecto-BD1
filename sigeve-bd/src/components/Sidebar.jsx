import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import ArticleIcon from '@mui/icons-material/Article';
import MapIcon from '@mui/icons-material/Map';
import RoomIcon from '@mui/icons-material/Room';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const menu = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Ordenes', icon: <ArticleIcon />, path: '/orders' },
  { text: 'Productos', icon: <Inventory2Icon />, path: '/products' },
  { text: 'Proveedores', icon: <WarehouseIcon />, path: '/suppliers' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Remitentes', icon: <LocalShippingIcon />, path: '/shippers' },
  { text: 'Regiones', icon: <MapIcon />, path: '/region' },
  { text: 'Territorios', icon: <RoomIcon />, path: '/territories' }
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
