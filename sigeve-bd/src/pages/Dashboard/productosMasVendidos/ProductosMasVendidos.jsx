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
import DashboardSection from '../../../components/ui/DashboardSection';
import ResponsiveChart from '../../../components/ui/ResponsiveChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';

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

    const ChartNode = (
      <Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'var(--text)' }}>Top 10 Productos</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ResponsiveChart height={400}>
            {({ width, height }) => (
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
                    color: 'var(--primary)',
                  }
                ]}
                height={height}
                width={width}
                margin={{ left: 60, right: 20, top: 20, bottom: 120 }}
              />
            )}
          </ResponsiveChart>
        </Box>
      </Box>
    );

    const DetailsNode = (
      <Box>
        <TableContainer sx={{ maxHeight: 380 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, py: 1.6, px: 3, fontSize: '.95rem', position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }}>Producto</TableCell>
                <TableCell align="center" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, py: 1.6, px: 3, fontSize: '.95rem', position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }}>Unidades vendidas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosPaginados.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ transition: 'background 0.15s ease', '&:hover': { background: '#f8fafc' }, '&:nth-of-type(odd)': { background: 'transparent' } }}
                >
                  <TableCell sx={{ py: 1.2, fontWeight: 600, color: 'var(--text)' }}>{row.productName}</TableCell>
                  <TableCell align="center" sx={{ color: 'var(--primary)', fontWeight: 700 }}>{row.totalUnitsSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas:"
          sx={{ borderTop: '1px solid rgba(0,0,0,0.06)', mt: 1 }}
        />
      </Box>
    );

    const stats = [
      { title: 'Unidades totales', value: `${unitsSold.reduce((a,b)=>a+b,0)}`, delta: '', icon: <BarChartIcon />, color: 'var(--primary)' },
      { title: 'Productos', value: datos.length, delta: '', icon: <PeopleIcon />, color: '#6b7280' },
      { title: 'Top', value: productNames[0] ?? '-', delta: '', icon: <StarIcon />, color: '#f59e0b' }
    ];

    return (
      <DashboardSection title="Productos más vendidos" subtitle="Top 10 productos por unidades vendidas" stats={stats} ChartNode={ChartNode} DetailsNode={DetailsNode} />
    );
}
