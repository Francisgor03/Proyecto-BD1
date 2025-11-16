import React, { useEffect, useState, useCallback } from 'react';
import { orderApi } from '../services/api';
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
  Button,
  IconButton,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import { Edit, Trash, Search } from 'lucide-react';
import FormOrder from '../components/orders/FormOrder';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openForm, setOpenForm] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const fetchOrders = useCallback(async (pageNum = 0, size = rowsPerPage) => {
    setLoading(true);
    try {
      // Llama al backend con paginación (page, size)
      const response = await orderApi.getAll(pageNum, size);
      const data = response.data || {};
      setOrders(data.content || []);
      setTotalElements(data.totalElements ?? ((data.totalPages ?? 0) * size));
    } catch (err) {
      console.error(err);
      setError('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  }, [rowsPerPage]);

  useEffect(() => {
    fetchOrders(page, rowsPerPage);
  }, [fetchOrders, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleNew = () => {
    setOrderToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = order => {
    setOrderToEdit(order);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar esta orden?')) {
      try {
        await orderApi.remove(id);
        fetchOrders(page);
      } catch (err) {
        console.error('Error al eliminar esta orden:', err);
      }
    }
  };

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
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box>
            <Typography variant='h5'>Listado de Ordenes</Typography>
          </Box>

          <Box display='flex' gap={2} alignItems='center'>
            <Button variant='contained' color='primary' onClick={handleNew}>
              Agregar Orden
            </Button>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Fecha de Orden</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Nombre Envio</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Dirreccion Envio</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Ciudad Envio</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Region Envio</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Codigo Postal Envio</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Pais Envio</TableCell>
              <TableCell align='center' sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              orders.slice(0, 10).map(o => (
                <TableRow key={o.id} sx={{ transition: 'background 0.2s', '&:hover': { background: '#f0f6ff' } }}>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{o.orderDate}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{o.shipName}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{o.shipAddress}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{o.shipCity}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{o.shipRegion}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{o.shipPostalCode}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{o.shipCountry}</TableCell>
                  <TableCell align='center' sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Stack direction='row' spacing={1} justifyContent='center'>
                      <IconButton color='primary' onClick={() => handleEdit(o)}>
                        <Edit size={18} />
                      </IconButton>
                      <IconButton color='error' onClick={() => handleDelete(o.id)}>
                        <Trash size={18} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
        />
      </TableContainer>

      {/* Modal de Formulario */}
      <FormOrder
        open={openForm}
        onClose={() => setOpenForm(false)}
        orderToEdit={orderToEdit}
        onSave={() => fetchOrders(page)}
      />
    </Box>
  );
}