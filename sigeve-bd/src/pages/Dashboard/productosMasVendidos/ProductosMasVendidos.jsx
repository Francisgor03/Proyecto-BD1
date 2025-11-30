import React, { useEffect, useState } from 'react';
import { productosMasVendidosApi } from '../../../services/api';
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
import { BarChart } from '@mui/x-charts/BarChart';

export default function ProductosMasVendidos() {
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
      const response = await productosMasVendidosApi.getAll();
      const data = response.data || [];
      setDatos(data);
      setTotalElements(data.length);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos más vendidos');
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
  
  const top10 = datos.slice(0, 10);
  const productNames = top10.map(row => row.productName);
  const unitsSold = top10.map(row => parseInt(row.totalUnitsSold));

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="300px"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
      {/* BarChart */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 6, flex: 3, minWidth: 450, maxWidth: 800, height: 500 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}>
          Top 10 Productos Más Vendidos
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <BarChart
            xAxis={[{ 
              scaleType: 'band', 
              data: productNames,
              tickLabelStyle: {
                angle: -45,
                textAnchor: 'end',
                fontSize: 11,
              }
            }]}
            series={[
              { 
                data: unitsSold, 
                label: 'Unidades Vendidas',
                color: '#4f8cff',
              }
            ]}
            height={400}
            width={700}
            margin={{ left: 60, right: 20, top: 20, bottom: 120 }}
          />
        </Box>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 6, flex: 1, minWidth: 400, maxWidth: 450, height: 500, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
                {['Producto', 'Unidades Vendidas'].map(title => (
                  <TableCell key={title} align="center" sx={{ color: '#fff', fontWeight: 700, py: 1 }}>{title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {datosPaginados.map((row, index) => (
                <TableRow key={index} sx={{ '&:hover': { background: '#e3f2fd' } }}>
                  <TableCell sx={{ py: 1 }}>{row.productName}</TableCell>
                  <TableCell align="center">{row.totalUnitsSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
          sx={{ borderTop: '1px solid #e0e0e0', flexShrink: 0 }}
        />
      </TableContainer>
    </Box>
  );
}
