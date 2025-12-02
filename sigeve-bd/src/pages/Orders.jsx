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
  Stack
} from '@mui/material';
import { Edit, Trash } from 'lucide-react';
import OrderDetails from '../components/orders/OrderDetails';
import FormOrder from '../components/orders/FormOrder';
import { useAlert } from '../utils/useAlert';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Orders() {
  const showAlert = useAlert();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openForm, setOpenForm] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const fetchOrders = useCallback(
    async (pageNum = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await orderApi.getAll(pageNum, size);
        const data = response.data || {};

        setOrders(data.content || []);
        setTotalElements(data.totalElements ?? 0);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las órdenes');
        showAlert('Error al cargar las órdenes', 'error');
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage, showAlert]
  );

  useEffect(() => {
    fetchOrders(page, rowsPerPage);
  }, [fetchOrders, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
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

  const handleDelete = id => {
    setDeleteId(id);
    setConfirmOpen(true);
  };


  const confirmDelete = async () => {
    try {
      await orderApi.remove(deleteId);
      showAlert('Orden eliminada correctamente', 'success');
      fetchOrders(page);
    } catch (err) {
      console.error('Error al eliminar esta orden:', err);
      showAlert('Error al eliminar la orden', 'error');
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
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
    <>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5'>Listado de Órdenes</Typography>

          <Button variant='contained' color='primary' onClick={handleNew}>
            Agregar Orden
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)'
              }}
            >
              {[
                'Fecha de Orden',
                'Nombre Envío',
                'Dirección',
                'Ciudad',
                'Región',
                'Código Postal',
                'País',
                'Acciones'
              ].map(head => (
                <TableCell
                  key={head}
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 0
                  }}
                  align={head === 'Acciones' ? 'center' : 'left'}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map(o => (
              <TableRow
                key={o.id}
                sx={{
                  transition: 'background 0.2s',
                  '&:hover': { background: '#f0f6ff' }
                }}
              >
                <TableCell>{o.orderDate}</TableCell>
                <TableCell>{o.shipName}</TableCell>
                <TableCell>{o.shipAddress}</TableCell>
                <TableCell>{o.shipCity}</TableCell>
                <TableCell>{o.shipRegion}</TableCell>
                <TableCell>{o.shipPostalCode}</TableCell>
                <TableCell>{o.shipCountry}</TableCell>

                <TableCell align='center'>
                  <Stack direction='row' spacing={1} justifyContent='center'>
                    <IconButton color='primary' onClick={() => handleEdit(o)}>
                      <Edit size={18} />
                    </IconButton>

                    <OrderDetails orderId={o.id} />

                    <IconButton color='error' onClick={() => handleDelete(o.id)}>
                      <Trash size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component='div'
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
        />
      </TableContainer>

      <FormOrder
        open={openForm}
        onClose={() => setOpenForm(false)}
        orderToEdit={orderToEdit}
        onSave={() => {
          fetchOrders(page);
          showAlert('Orden guardada correctamente', 'success');
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title='Eliminar Orden'
        message='¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.'
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
