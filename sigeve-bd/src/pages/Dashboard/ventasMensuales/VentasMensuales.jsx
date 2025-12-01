import React, { useEffect, useState, useMemo } from 'react';
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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TableSortLabel,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import ResponsiveChart from '../../../components/ui/ResponsiveChart';
import DashboardSection from '../../../components/ui/DashboardSection';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// helpers for sorting
function descendingComparator(a, b, prop) {
  let va;
  let vb;
  if (prop === 'mesAnyo') {
    va = `${a.year}-${String(a.month).padStart(2, '0')}`;
    vb = `${b.year}-${String(b.month).padStart(2, '0')}`;
  } else {
    va = a[prop];
    vb = b[prop];
  }
  const na = parseFloat(va);
  const nb = parseFloat(vb);
  if (!isNaN(na) && !isNaN(nb)) return nb - na;
  if (va < vb) return 1;
  if (va > vb) return -1;
  return 0;
}

function getComparatorFn(ord, prop) {
  return ord === 'desc'
    ? (a, b) => descendingComparator(a, b, prop)
    : (a, b) => -descendingComparator(a, b, prop);
}

function stableSortFn(array, comparator) {
  const stabilized = array.map((el, idx) => [el, idx]);
  stabilized.sort((a, b) => {
    const orderRes = comparator(a[0], b[0]);
    if (orderRes !== 0) return orderRes;
    return a[1] - b[1];
  });
  return stabilized.map(el => el[0]);
}

export default function VentasMensuales() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [añoSeleccionado, setAñoSeleccionado] = useState('todos');

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

  const añosDisponibles = useMemo(() => {
    const años = [...new Set(datos.map(row => row.year))].sort((a, b) => a - b);
    return años;
  }, [datos]);

  const datosFiltrados = useMemo(() => {
    if (añoSeleccionado === 'todos') {
      return datos;
    }
    return datos.filter(row => row.year === añoSeleccionado);
  }, [datos, añoSeleccionado]);

  // sorting state for table
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('totalSales');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedDatos = useMemo(() => stableSortFn(datosFiltrados, getComparatorFn(order, orderBy)), [datosFiltrados, order, orderBy]);
  const datosPaginados = sortedDatos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  const xLabels = datosFiltrados.map(row => `${row.month}/${row.year}`);
  const yValues = datosFiltrados.map(row => parseFloat(row.totalSales));

  useEffect(() => {
    setPage(0);
    setTotalElements(datosFiltrados.length);
  }, [añoSeleccionado, datosFiltrados.length]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="300px"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const ChartNode = (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>Evolución de Ventas</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Año</InputLabel>
          <Select
            value={añoSeleccionado}
            label="Año"
            onChange={(e) => setAñoSeleccionado(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {añosDisponibles.map(año => (
              <MenuItem key={año} value={año}>{año}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ResponsiveChart height={360}>
            {({ width, height }) => (
              <LineChart
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                series={[
                  {
                    data: yValues,
                    label: 'Total Ventas',
                    color: 'var(--primary)',
                    curve: 'natural'
                  }
                ]}
                height={height}
                width={width}
                margin={{ left: 70, right: 20, top: 20, bottom: 50 }}
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
              <TableCell align="left" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, py: 1.6, px: 3, fontSize: '.95rem', position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }} sortDirection={orderBy === 'mesAnyo' ? order : false}>
                <TableSortLabel sx={{ color: '#fff' }} active={orderBy === 'mesAnyo'} direction={orderBy === 'mesAnyo' ? order : 'asc'} onClick={(e) => handleRequestSort(e, 'mesAnyo')}>
                  Mes / Año
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ background: 'var(--primary-700)', color: '#fff', fontWeight: 700, py: 1.6, px: 3, fontSize: '.95rem', position: 'sticky', top: 0, zIndex: 3, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' }} sortDirection={orderBy === 'totalSales' ? order : false}>
                <TableSortLabel sx={{ color: '#fff' }} active={orderBy === 'totalSales'} direction={orderBy === 'totalSales' ? order : 'asc'} onClick={(e) => handleRequestSort(e, 'totalSales')}>
                  Total ventas (USD)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPaginados.map((row, index) => (
              <TableRow
                key={index}
                sx={{ transition: 'background 0.15s ease', '&:hover': { background: '#f8fafc' }, '&:nth-of-type(odd)': { background: 'transparent' } }}
              >
                <TableCell sx={{ py: 1.2, fontWeight: 600, color: 'var(--text)' }}>{row.month}/{row.year}</TableCell>
                <TableCell align="center" sx={{ color: 'var(--primary)', fontWeight: 700 }}>${row.totalSales?.toFixed(2)}</TableCell>
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
    { title: 'Ingresos (hoy)', value: '$1,240', delta: '4.2%', icon: <AttachMoneyIcon />, color: 'var(--primary)' },
    { title: 'Mes actual', value: '$32,100', delta: '2.1%', icon: <CalendarMonthIcon />, color: '#10b981' },
    { title: 'Crecimiento', value: '5.2%', delta: '▲', icon: <TrendingUpIcon />, color: '#6b7280' }
  ];

  return (
    <DashboardSection title="Evolución de Ventas" subtitle="Resumen mensual y detalles" stats={stats} ChartNode={ChartNode} DetailsNode={DetailsNode} />
  );
}

