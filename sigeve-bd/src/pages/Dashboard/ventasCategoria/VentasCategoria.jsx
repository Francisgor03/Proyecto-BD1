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
import DashboardSection from '../../../components/ui/DashboardSection';
import ResponsiveChart from '../../../components/ui/ResponsiveChart';
import CategoryIcon from '@mui/icons-material/Category';
import PieChartIcon from '@mui/icons-material/PieChart';
import PeopleIcon from '@mui/icons-material/People';

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

  const ChartNode = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ResponsiveChart height={350}>
        {({ width, height }) => (
          <PieChart
            series={[{
              data: datos.map((row, index) => ({
                id: index,
                value: row.totalUnidadesVendidas,
                label: row.nombreCategoria,
              })),
              innerRadius: 50,
              outerRadius: Math.min(160, Math.floor(height / 1.5)),
              paddingAngle: 2,
              cornerRadius: 6,
            }]}
            height={height}
            width={Math.min(width, 600)}
            slotProps={{ legend: { hidden: false, position: 'right' } }}
          />
        )}
      </ResponsiveChart>
    </Box>
  );

  const DetailsNode = (
    <Box>
      <TableContainer sx={{ maxHeight: 380 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, fontSize: '.95rem', py: 1.6, px: 3, position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }}>Categoría</TableCell>
              <TableCell align="center" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, fontSize: '.95rem', py: 1.6, px: 3, position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }}>Pedidos</TableCell>
              <TableCell align="center" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, fontSize: '.95rem', py: 1.6, px: 3, position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }}>Unidades</TableCell>
              <TableCell align="center" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, fontSize: '.95rem', py: 1.6, px: 3, position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }}>Precio promedio (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row, index) => (
              <TableRow key={index} sx={{ transition: 'background 0.15s', '&:hover': { background: '#f8fafc' } }}>
                <TableCell sx={{ py: 1, fontWeight: 600, color: 'var(--text)' }}>{row.nombreCategoria}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>{row.totalPedidos}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>{row.totalUnidadesVendidas}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: 'var(--primary)' }}>${row.precioPromedioVenta?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const stats = [
    { title: 'Categorías', value: datos.length, delta: '', icon: <CategoryIcon />, color: 'var(--primary)' },
    { title: 'Unidades', value: datos.reduce((s, r) => s + (r.totalUnidadesVendidas || 0), 0), delta: '', icon: <PieChartIcon />, color: '#6b7280' },
    { title: 'Clientes', value: datos.reduce((s, r) => s + (r.totalPedidos || 0), 0), delta: '', icon: <PeopleIcon />, color: '#10b981' }
  ];

  return (
    <DashboardSection title="Ventas por Categoría" subtitle="Distribución y totales" stats={stats} ChartNode={ChartNode} DetailsNode={DetailsNode} />
  );
}
