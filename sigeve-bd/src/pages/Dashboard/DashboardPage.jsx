import React, { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import VentasCategoria from './ventasCategoria/VentasCategoria';
import VentasMensuales from './ventasMensuales/VentasMensuales';
import ProductosMasVendidos from './productosMasVendidos/ProductosMasVendidos';

export default function DashboardPage() {
  const [vistaActiva, setVistaActiva] = useState('categorias');

  const vistas = [
    { id: 'categorias', label: 'Por Categoría', color: '#2196f3' },
    { id: 'mensuales', label: 'Mensuales', color: '#1976d2' },
    { id: 'productos', label: 'Top Productos', color: '#1565c0' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'transparent', py: 3 }}>
      <div className="app-container">
        <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text)', mb: 0.5 }}>Dashboard de Ventas</Typography>
              <Typography variant="body2" sx={{ color: 'var(--muted)' }}>Visualización de datos y métricas clave</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          {vistas.map((vista) => (
            <Chip
              key={vista.id}
              label={vista.label}
              onClick={() => setVistaActiva(vista.id)}
              sx={{
                px: 2,
                py: 1.2,
                fontSize: '0.95rem',
                fontWeight: vistaActiva === vista.id ? 600 : 500,
                bgcolor: vistaActiva === vista.id ? vista.color : '#fff',
                color: vistaActiva === vista.id ? '#fff' : '#555',
                border: vistaActiva === vista.id ? 'none' : '1px solid #e6e9ef',
                cursor: 'pointer',
                '&:hover': { bgcolor: vistaActiva === vista.id ? vista.color : '#fff' },
              }}
            />
          ))}
        </Box>
        <Box sx={{ background: 'var(--card-bg)', borderRadius: 2, boxShadow: 'var(--card-shadow)', p: 2 }}>
          {vistaActiva === 'categorias' && <VentasCategoria />}
          {vistaActiva === 'mensuales' && <VentasMensuales />}
          {vistaActiva === 'productos' && <ProductosMasVendidos />}
        </Box>
      </div>
    </Box>
  );
}

