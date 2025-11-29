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

export default function ReporteDetallePedidos() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('idPedido');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await reportesApi.getDetallePedidos();
      setDatos(response.data || []);
    } catch (err) {
      setError('Error al cargar el reporte: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtrarDatos = () => {
    return datos.filter(row => {
      const texto = `${row.cliente} ${row.producto} ${row.ciudad} ${row.categoria} ${row.idPedido}`.toLowerCase();

      const coincideTexto = texto.includes(search.toLowerCase());

      const fecha = new Date(row.fechaPedido);
      const cumpleInicio = !fechaInicio || fecha >= new Date(fechaInicio);
      const cumpleFin = !fechaFin || fecha <= new Date(fechaFin);

      return coincideTexto && cumpleInicio && cumpleFin;
    });
  };

  const handleSort = prop => {
    const isAsc = orderBy === prop && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(prop);
  };

  const sortData = array => {
    return [...array].sort((a, b) => {
      const valA = a[orderBy];
      const valB = b[orderBy];

      if (orderBy === 'fechaPedido') {
        return order === 'asc' ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
      }

      if (typeof valA === 'string') {
        return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return order === 'asc' ? valA - valB : valB - valA;
    });
  };

  const filtrados = filtrarDatos();
  const ordenados = sortData(filtrados);
  const datosPaginados = ordenados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  return (
    <Box p={3}>
      {/* HEADER DEL REPORTE */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant='h5'>Reporte de detalle de Pedidos</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          Vista completa de pedidos con productos y totales
        </Typography>
        <ReporteToolbar
          data={ordenados} // <-- exportar Excel usa esta data
          onSearch={txt => setSearch(txt)} // <-- buscador
          onDateChange={(ini, fin) => {
            // <-- fechas
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
                { id: 'idPedido', label: 'ID Pedido' },
                { id: 'fechaPedido', label: 'Fecha' },
                { id: 'cliente', label: 'Cliente' },
                { id: 'ciudad', label: 'Ciudad' },
                { id: 'producto', label: 'Producto' },
                { id: 'categoria', label: 'Categoría' },
                { id: 'cantidad', label: 'Cantidad' },
                { id: 'precioUnitario', label: 'Precio Unit.' },
                { id: 'descuento', label: 'Descuento' },
                { id: 'totalLinea', label: 'Total Línea' }
              ].map(col => (
                <TableCell key={col.id} sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleSort(col.id)}
                    sx={{
                      color: '#fff',
                      '& .MuiTableSortLabel-icon': { color: '#fff' }
                    }}
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
                <TableCell>{row.idPedido}</TableCell>
                <TableCell>{row.fechaPedido}</TableCell>
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.ciudad}</TableCell>
                <TableCell>{row.producto}</TableCell>
                <TableCell>{row.categoria}</TableCell>
                <TableCell>{row.cantidad}</TableCell>
                <TableCell>${row.precioUnitario?.toFixed(2)}</TableCell>
                <TableCell>{(row.descuento * 100).toFixed(0)}%</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#4caf50' }}>${row.totalLinea?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINACIÓN */}
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
