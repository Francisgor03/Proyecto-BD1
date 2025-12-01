import React, { useEffect, useState } from 'react';
import { reportesApi } from '../services/api';
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
  TableSortLabel
} from '@mui/material';

import ReporteToolbar from '../components/reporte-detalle-pedidos/ReporteToolBar';

export default function ReporteVentasClienteRegion() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------- ORDENAMIENTO ----------------
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('cliente');

  // ---------------- PAGINACIÓN ------------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ---------------- FILTROS --------------------
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // ============================
  // CARGAR DATOS
  // ============================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await reportesApi.getVentasClienteRegion();
      setDatos(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // FILTRO GLOBAL + FECHAS
  // (si tu API no incluye fechas, solo ignora las condiciones)
  // ============================
  const filtrarDatos = () => {
    return datos.filter(row => {
    const texto = `${row.cliente} ${row.pais} ${row.ciudad} ${row.region}`.toLowerCase();

      const coincideTexto = texto.includes(search.toLowerCase());

      // Si NO tiene fecha, simplemente no filtra
      if (!row.fecha) return coincideTexto;

      const fecha = new Date(row.fecha);
      const cumpleInicio = !fechaInicio || fecha >= new Date(fechaInicio);
      const cumpleFin = !fechaFin || fecha <= new Date(fechaFin);

      return coincideTexto && cumpleInicio && cumpleFin;
    });
  };

  // ============================
  // ORDENAMIENTO
  // ============================
  const handleSort = prop => {
    const isAsc = orderBy === prop && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(prop);
  };

  const sortData = array => {
    return [...array].sort((a, b) => {
      const valA = a[orderBy];
      const valB = b[orderBy];

      if (typeof valA === 'string') {
        return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      const numA = Number(valA);
      const numB = Number(valB);

      return order === 'asc' ? numA - numB : numB - numA;
    });
  };

  // ============================
  // FILTRADO + ORDENADO + PAGINADO
  // ============================
  const filtrados = filtrarDatos();
  const ordenados = sortData(filtrados);
  const datosPaginados = ordenados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ============================
  // LOADING / ERROR
  // ============================
  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='70vh'>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  // ============================
  // RENDER FINAL
  // ============================
  return (
    <Box p={3}>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant='h5'>Reporte de Ventas por Cliente y Región</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          Resumen de ventas totales agrupadas por cliente
        </Typography>

        {/* TOOLBAR */}
        <ReporteToolbar
          data={ordenados}
          onSearch={txt => setSearch(txt)}
          onDateChange={(ini, fin) => {
            setFechaInicio(ini);
            setFechaFin(fin);
          }}
        />
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
             {[
              { id: 'cliente', label: 'Cliente' },
              { id: 'pais', label: 'País' },
              { id: 'region', label: 'Región' },
              { id: 'ciudad', label: 'Ciudad' },
              { id: 'totalPedidos', label: 'Total Pedidos' },
              { id: 'totalVendido', label: 'Total Vendido' },
              { id: 'promedioLinea', label: 'Promedio/Línea' }
              // Removimos 'contacto' de la tabla principal
            ].map(col => (
              <TableCell key={col.id} sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={() => handleSort(col.id)}
                  sx={{ color: '#fff', '& .MuiTableSortLabel-icon': { color: '#fff' } }}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {datosPaginados.map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { background: '#f0f6ff' } }}>
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.pais}</TableCell>
                <TableCell>{row.region || 'N/A'}</TableCell>
                <TableCell>{row.ciudad}</TableCell>
                <TableCell>{row.totalPedidos}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#4caf50' }}>${row.totalVendido?.toFixed(2)}</TableCell>
                <TableCell>${row.promedioLinea?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component='div'
          count={ordenados.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage='Filas por página:'
        />
      </TableContainer>
    </Box>
  );
}
