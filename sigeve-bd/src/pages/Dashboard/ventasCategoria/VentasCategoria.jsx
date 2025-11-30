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
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
      {/* PieChart */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 6, flex: 3, minWidth: 450, maxWidth: 700, height: 450 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}>
          Ventas por Categoría
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
            series={[{
              data: datos.map((row, index) => ({
                id: index,
                value: row.totalUnidadesVendidas,
                label: row.nombreCategoria,
              })),
              innerRadius: 50,
              outerRadius: 160,
              paddingAngle: 2,
              cornerRadius: 6,
            }]}
            height={350}
            width={350}
            slotProps={{ legend: { hidden: false, position: 'right' } }}
          />
        </Box>
      </Paper>

      {/* Tabla */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 6, flex: 1, minWidth: 300, maxWidth: 350, height: 450, overflow: 'auto' }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
              {['Cat', 'Ped', 'Und', 'Prom'].map((title) => (
                <TableCell key={title} align="center" sx={{ color: '#fff', fontWeight: 700, fontSize: '.85rem', py: 1 }}>
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row, index) => (
              <TableRow key={index} sx={{
                transition: '0.2s',
                '&:hover': { background: '#e3f2fd' },
              }}>
                <TableCell sx={{ py: 1 }}>{row.nombreCategoria}</TableCell>
                <TableCell align="center">{row.totalPedidos}</TableCell>
                <TableCell align="center">{row.totalUnidadesVendidas}</TableCell>
                <TableCell align="center">${row.precioPromedioVenta?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
