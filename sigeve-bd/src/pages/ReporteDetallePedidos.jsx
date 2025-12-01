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

// CAMBIO: Eliminar ReporteToolbar, mantener los otros imports
import ExportExcelButton from '../components/exportExcelButton';
import SearchDropdown from '../components/searchDropdown';

export default function ReporteDetallePedidos() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('asc');
  // CAMBIO: Cambiar ordenamiento por defecto a cliente
  const [orderBy, setOrderBy] = useState('cliente');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // CAMBIO: Reemplazar search por filtros específicos
  const [clienteFilter, setClienteFilter] = useState('');
  const [productoFilter, setProductoFilter] = useState('');
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
      const coincideCliente = !clienteFilter || 
        row.cliente.toLowerCase().includes(clienteFilter.toLowerCase());
      
      const coincideProducto = !productoFilter ||
        row.producto.toLowerCase().includes(productoFilter.toLowerCase());

      const fecha = new Date(row.fechaPedido);
      const cumpleInicio = !fechaInicio || fecha >= new Date(fechaInicio);
      const cumpleFin = !fechaFin || fecha <= new Date(fechaFin);

      return coincideCliente && coincideProducto && cumpleInicio && cumpleFin;
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
        {/* CAMBIO: Header con botón exportar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant='h5'>Reporte de detalle de Pedidos</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Vista completa de pedidos con productos y totales
            </Typography>
          </Box>
          <ExportExcelButton 
            data={ordenados}
            filename="detalle_pedidos"
            buttonText="Exportar Excel"
          />
        </Box>
        
        {/* CAMBIO: Dropdowns de filtro */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2, flexWrap: 'wrap' }}>
          <SearchDropdown 
            data={ordenados}
            onFilterSelect={setClienteFilter}
            filterType="cliente"
            label="Filtrar por cliente..."
            width={250}
          />
          
          <SearchDropdown 
            data={ordenados}
            onFilterSelect={setProductoFilter}
            filterType="producto"
            label="Filtrar por producto..."
            width={250}
          />
        </Box>
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
              {/* CAMBIO: Columnas reducidas - eliminar idPedido, fechaPedido, ciudad, categoria */}
              {[
                { id: 'cliente', label: 'Cliente' },
                { id: 'producto', label: 'Producto' },
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
            {/* CAMBIO: Solo mostrar columnas visibles */}
            {datosPaginados.map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { background: '#f0f6ff' } }}>
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.producto}</TableCell>
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