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

import SearchDropdown from '../components/searchDropdown'; 
import ExportExcelButton from '../components/exportExcelButton';
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
  const [clienteFilter, setClienteFilter] = useState('');
  const [paisFilter, setPaisFilter] = useState('');
  const [ciudadFilter, setCiudadFilter] = useState('');
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
  // FILTRO CON DROPDOWNS
  // ============================
  const filtrarDatos = () => {
    return datos.filter(row => {
      // Filtro por cliente
      const coincideCliente = !clienteFilter || 
        row.cliente.toLowerCase().includes(clienteFilter.toLowerCase());
      
      // Filtro por país
      const coincidePais = !paisFilter ||
        row.pais.toLowerCase().includes(paisFilter.toLowerCase());
      
      // Filtro por ciudad
      const coincideCiudad = !ciudadFilter ||
        row.ciudad.toLowerCase().includes(ciudadFilter.toLowerCase());

      // Filtro por fechas (si aplica)
      if (!row.fecha) return coincideCliente && coincidePais && coincideCiudad;

      const fecha = new Date(row.fecha);
      const cumpleInicio = !fechaInicio || fecha >= new Date(fechaInicio);
      const cumpleFin = !fechaFin || fecha <= new Date(fechaFin);

      return coincideCliente && coincidePais && coincideCiudad && cumpleInicio && cumpleFin;
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant='h5'>Reporte de Ventas por Cliente y Región</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Resumen de ventas totales agrupadas por cliente
            </Typography>
          </Box>
          <ExportExcelButton 
            data={ordenados}
            filename="ventas_cliente_region"
            buttonText="Exportar Excel"
          />
        </Box>

        {/* DROPDOWNS DE FILTRO */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2, flexWrap: 'wrap' }}>
          <SearchDropdown 
            data={ordenados}
            onFilterSelect={setClienteFilter}
            filterType="cliente"
            label="Buscar cliente..."
            width={250}
          />
          
          <SearchDropdown 
            data={ordenados}
            onFilterSelect={setPaisFilter}
            filterType="pais"
            label="Filtrar por país..."
            width={200}
          />
          
          <SearchDropdown 
            data={ordenados}
            onFilterSelect={setCiudadFilter}
            filterType="ciudad"
            label="Filtrar por ciudad..."
            width={200}
          />
        </Box>
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
              {[
                { id: 'cliente', label: 'Cliente' },
                { id: 'pais', label: 'País' },
                { id: 'ciudad', label: 'Ciudad' },
                { id: 'totalPedidos', label: 'Total Pedidos' },
                { id: 'totalVendido', label: 'Total Vendido' },
                { id: 'promedioLinea', label: 'Promedio/Línea' }
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