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
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

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

  const datosPaginados = datosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  const xLabels = datosFiltrados.map(row => `${row.month}/${row.year}`);
  const yValues = datosFiltrados.map(row => parseFloat(row.totalSales));

  useEffect(() => {
    setPage(0);
    setTotalElements(datosFiltrados.length);
  }, [añoSeleccionado, datosFiltrados.length]);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="300px"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, width: '100%' }}>
      {/* LineChart */}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: '#444',
            }}
          >
            Evolución de Ventas
          </Typography>
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
          <LineChart
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            series={[
              { 
                data: yValues, 
                label: 'Total Ventas',
                color: '#1976d2',
                curve: 'natural'
              }
            ]}
            height={360}
            width={600}
            margin={{ left: 70, right: 20, top: 20, bottom: 50 }}
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
          minWidth: 400, 
          maxWidth: 450, 
          height: 460, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
        }}
      >
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: '#1976d2' }}>
                {['Mes/Año', 'Total Ventas'].map(title => (
                  <TableCell key={title} align="center" sx={{ color: '#fff', fontWeight: 600, py: 1.2 }}>{title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {datosPaginados.map((row, index) => (
                <TableRow 
                  key={index} 
                  sx={{ 
                    '&:hover': { 
                      background: '#f5f5f5',
                    }
                  }}
                >
                  <TableCell sx={{ py: 1.2, fontWeight: 500, color: '#333' }}>{row.month}/{row.year}</TableCell>
                  <TableCell align="center" sx={{ color: '#1976d2', fontWeight: 500 }}>${row.totalSales?.toFixed(2)}</TableCell>
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
          labelRowsPerPage="Filas:"
          sx={{ 
            borderTop: '1px solid #e0e0e0', 
            flexShrink: 0,
          }}
        />
      </TableContainer>
    </Box>
  );
}
