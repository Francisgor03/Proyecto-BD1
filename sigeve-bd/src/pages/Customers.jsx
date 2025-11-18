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
  TablePagination,
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
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openForm, setOpenForm] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const fetchCustomers = React.useCallback(
    async (pageNum = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await customerApi.getAll(pageNum, size);
        const data = response.data || {};
        setCustomers(data.content || []);
        setTotalElements(data.totalElements ?? (data.totalPages ?? 0) * size);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchCustomers(page, rowsPerPage);
  }, [page, rowsPerPage, fetchCustomers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
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
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5">Listado de Clientes</Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <Button variant="contained" color="primary" onClick={handleNew}>
              Agregar Cliente
            </Button>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Nombre</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Compañía</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Ciudad</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Teléfono</TableCell>
              <TableCell align='center' sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(c => (
              <TableRow key={c.id} sx={{ transition: "background 0.2s", "&:hover": { background: "#f0f6ff" } }}>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{c.contactName}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{c.companyName}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{c.city}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{c.phone}</TableCell>
                <TableCell align='center' sx={{ borderBottom: "1px solid #e0e0e0" }}>
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
