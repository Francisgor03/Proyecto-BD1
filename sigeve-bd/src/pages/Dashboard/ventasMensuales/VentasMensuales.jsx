import React, { useEffect, useState } from 'react';
import { ventasMensualesApi } from '../../../services/api';
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
  TablePagination,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

export default function VentasMensuales() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ventasMensualesApi.getAll();
      const data = response.data || [];
      setDatos(data);
      setTotalElements(data.length);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las ventas mensuales');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const datosPaginados = datos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const chartData = datos.map(row => ({ x: `${row.month}/${row.year}`, y: row.totalSales }));

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="300px"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
      {/* LineChart */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 6, flex: 3, minWidth: 450, maxWidth: 700, height: 450 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}>
          Ventas Mensuales
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LineChart
            series={[{ data: chartData, xKey: 'x', yKey: 'y', label: 'Total Ventas', line: { color: '#4f8cff', width: 3 } }]}
            height={350}
            width={500}
            slotProps={{ legend: { hidden: false, position: 'bottom' } }}
          />
        </Box>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 6, flex: 1, minWidth: 300, maxWidth: 350, height: 450, display: 'flex', flexDirection: 'column' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
              {['Mes/Año', 'Total Ventas'].map(title => (
                <TableCell key={title} align="center" sx={{ color: '#fff', fontWeight: 700, py: 1 }}>{title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPaginados.map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { background: '#e3f2fd' } }}>
                <TableCell sx={{ py: 1 }}>{row.month}/{row.year}</TableCell>
                <TableCell align="center">${row.totalSales?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>
    </Box>
  );
}
