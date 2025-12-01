import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import ArticleIcon from '@mui/icons-material/Article';
import MapIcon from '@mui/icons-material/Map';
import RoomIcon from '@mui/icons-material/Room';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BadgeIcon from '@mui/icons-material/Badge';

import { useNavigate } from 'react-router-dom';
import { BarChartIcon } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const menu = [
    {
      title: 'Gestión Comercial',
      items: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Clientes', icon: <PeopleIcon />, path: '/customers' },
        { text: 'Ordenes', icon: <ArticleIcon />, path: '/orders' },
        { text: 'Productos', icon: <Inventory2Icon />, path: '/products' },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/categories' },
        { text: 'Proveedores', icon: <WarehouseIcon />, path: '/suppliers' },
        { text: 'Empleados', icon: <BadgeIcon />, path: '/employees' }
      ]
    },
    {
      title: 'Logística',
      items: [
        { text: 'Remitentes', icon: <LocalShippingIcon />, path: '/shippers' },
        { text: 'Regiones', icon: <MapIcon />, path: '/region' },
        { text: 'Territorios', icon: <RoomIcon />, path: '/territories' }
      ]
    },
    {
      title: 'Reportes',
      items: [
        { text: 'Detalle Pedidos', icon: <ReceiptLongIcon />, path: '/reportes/detalle-pedidos' },
        { text: 'Reporte Ventas', icon: <BarChartIcon />, path: '/reportes/ventas-cliente-region' }
      ]
    }
  ];

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: 'var(--primary)',
        color: 'var(--on-primary)',
        p: 2,
        height: '100vh',
        position: 'sticky', 
        top: 0, 
        overflowY: 'auto',
        boxShadow: 'var(--card-shadow)'
      }}
    >
      <Typography variant='h6' sx={{ ml: 1, mb: 2, fontWeight: 700 }}>
        SIGEVE
      </Typography>

      {menu.map(section => (
        <Accordion
          key={section.title}
          disableGutters
          sx={{
            backgroundColor: 'transparent',
            color: 'var(--on-primary)',
            boxShadow: 'none',
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--on-primary)' }} />}>
            <Typography sx={{ fontSize: 14 }}>{section.title}</Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <List>
              {section.items.map(item => (
                <ListItemButton
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    pl: 4,
                    color: 'var(--on-primary)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'var(--on-primary)' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
