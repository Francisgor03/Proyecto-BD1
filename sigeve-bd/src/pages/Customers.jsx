import React, { useEffect, useState } from 'react';
import { customerApi } from '../services/api';
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
import FormCustomer from '../components/customers/FormCustomer';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const fetchCustomers = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await customerApi.getAll(pageNum, 10);
      setCustomers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleNew = () => {
    setCustomerToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = customer => {
    setCustomerToEdit(customer);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      try {
        await customerApi.remove(id);
        fetchCustomers(page);
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
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
        <Typography variant='h5'>Lista de Clientes</Typography>
        <Button variant='contained' color='primary' onClick={handleNew}>
          Nuevo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombrae</TableCell>
              <TableCell>Compañía</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.contactName}</TableCell>
                <TableCell>{c.companyName}</TableCell>
                <TableCell>{c.city}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell align='center'>
                  <Stack direction='row' spacing={1} justifyContent='center'>
                    <IconButton color='primary' onClick={() => handleEdit(c)}>
                      <Edit size={18} />
                    </IconButton>
                    <IconButton color='error' onClick={() => handleDelete(c.id)}>
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

      {/* 🔹 Modal de Formulario */}
      <FormCustomer
        open={openForm}
        onClose={() => setOpenForm(false)}
        customerToEdit={customerToEdit}
        onSave={() => fetchCustomers(page)}
      />
    </Box>
  );
}
