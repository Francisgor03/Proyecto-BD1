import React, { useEffect, useState } from 'react';
import { ventasCategoriaApi } from '../../../services/api';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

export default function VentasCategoria() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ventasCategoriaApi.getAll();
      setDatos(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el reporte de categorías');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, width: '100%' }}>
      {/* PieChart */}
      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          background: '#fff',
          border: '1px solid #e0e0e0',
          flex: 3, 
          minWidth: 450, 
          maxWidth: 700, 
          height: 460,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: '#444',
          }}
        >
          Distribución de Ventas
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
            series={[{
              data: datos.map((row, index) => ({
                id: index,
                value: row.totalUnidadesVendidas,
                label: row.nombreCategoria,
              })),
              innerRadius: 50,
              outerRadius: 150,
              paddingAngle: 2,
              cornerRadius: 5,
            }]}
            height={360}
            width={400}
            slotProps={{ legend: { hidden: false, position: 'right' } }}
          />
        </Box>
      </Paper>

      {/* Tabla */}
      <TableContainer
        component={Paper}
        sx={{ 
          borderRadius: 2, 
          background: '#fff',
          border: '1px solid #e0e0e0',
          flex: 1, 
          minWidth: 300, 
          maxWidth: 350, 
          height: 460, 
          overflow: 'auto',
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#1976d2' }}>
              {['Categoría', 'Pedidos', 'Unidades', 'Precio Prom.'].map((title) => (
                <TableCell key={title} align="center" sx={{ color: '#fff', fontWeight: 600, fontSize: '.85rem', py: 1.2 }}>
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row, index) => (
              <TableRow key={index} sx={{
                '&:hover': { 
                  background: '#f5f5f5',
                },
              }}>
                <TableCell sx={{ py: 1.2, fontWeight: 500, color: '#333' }}>{row.nombreCategoria}</TableCell>
                <TableCell align="center" sx={{ color: '#666' }}>{row.totalPedidos}</TableCell>
                <TableCell align="center" sx={{ color: '#666' }}>{row.totalUnidadesVendidas}</TableCell>
                <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 500 }}>${row.precioPromedioVenta?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
