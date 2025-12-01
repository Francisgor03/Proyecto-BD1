import React, { useState } from "react";
import { Box, Typography, Container, Button, Chip } from "@mui/material";
import VentasCategoria from "./ventasCategoria/VentasCategoria";
import VentasMensuales from "./ventasMensuales/VentasMensuales";
import ProductosMasVendidos from "./productosMasVendidos/ProductosMasVendidos";

export default function DashboardPage() {
  const [vistaActiva, setVistaActiva] = useState('categorias');

  const vistas = [
    { id: 'categorias', label: 'Por Categoría', color: '#2196f3' },
    { id: 'mensuales', label: 'Mensuales', color: '#1976d2' },
    { id: 'productos', label: 'Top Productos', color: '#1565c0' },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: '#f5f5f5',
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#333',
              mb: 0.5,
            }}
          >
            Dashboard de Ventas
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
            }}
          >
            Visualización de datos
          </Typography>
        </Box>

        {/* Tabs de navegación */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
          {vistas.map((vista) => (
            <Chip
              key={vista.id}
              label={vista.label}
              onClick={() => setVistaActiva(vista.id)}
              sx={{
                px: 2,
                py: 2.5,
                fontSize: '0.95rem',
                fontWeight: vistaActiva === vista.id ? 600 : 500,
                bgcolor: vistaActiva === vista.id ? vista.color : '#fff',
                color: vistaActiva === vista.id ? '#fff' : '#555',
                border: vistaActiva === vista.id ? 'none' : '1px solid #ddd',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: vistaActiva === vista.id ? vista.color : '#fafafa',
                },
              }}
            />
          ))}
        </Box>

        {/* Contenido */}
        <Box>
          {vistaActiva === 'categorias' && <VentasCategoria />}
          {vistaActiva === 'mensuales' && <VentasMensuales />}
          {vistaActiva === 'productos' && <ProductosMasVendidos />}
        </Box>
      </Container>
    </Box>
  );
}
