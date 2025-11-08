import React, { useEffect, useState } from 'react';
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
    Pagination,
    Button,
    IconButton,
    Stack
} from '@mui/material';
import { Edit, Trash } from 'lucide-react';
import FormOrder from '../components/orders/FormOrder';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const fetchOrders = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await orderApi.getAll(pageNum, 10);
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los ordenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
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
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h5'>Lista de Ordenes</Typography>
        <Button variant='contained' color='primary' onClick={handleNew}>
          Nuevo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>OrderDate</TableCell>
              <TableCell>ShipName</TableCell>
              <TableCell>ShipAddress</TableCell>
              <TableCell>ShipCity</TableCell>
              <TableCell>ShipRegion</TableCell>
              <TableCell>ShipPostalCode</TableCell>
              <TableCell>ShipCountry</TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(o => (
              <TableRow key={o.id}>
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
                    <IconButton color='error' onClick={() => handleDelete(o.id)}>
                      <Trash size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display='flex' justifyContent='center' mt={2}>
        <Pagination count={totalPages} page={page + 1} onChange={handlePageChange} color='primary' shape='rounded' />
      </Box>

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
