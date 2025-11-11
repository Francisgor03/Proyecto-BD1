import React, { useEffect, useState } from 'react';
import { shipperApi } from '../services/api';
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
import FormShipper from '../components/shippers/FormShipper';

export default function Shippers() {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [shipperToEdit, setShipperToEdit] = useState(null);

  const fetchShippers = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await shipperApi.getAll(pageNum, 10);
      setShippers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippers(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleNew = () => {
    setShipperToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = shipper => {
    setShipperToEdit(shipper);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      try {
        await shipperApi.remove(id);
        fetchShippers(page);
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
        <Typography variant='h5'>Lista de Remitentes</Typography>
        <Button variant='contained' color='primary' onClick={handleNew}>
          Nuevo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>Nombre</TableCell> */}
              <TableCell>Compañía</TableCell>
              {/* <TableCell>Ciudad</TableCell> */}
              <TableCell>Teléfono</TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippers.map(s => (
              <TableRow key={s.id}>
                {/* <TableCell>{c.contactName}</TableCell> */}
                <TableCell>{s.companyName}</TableCell>
                {/* <TableCell>{c.city}</TableCell> */}
                <TableCell>{s.phone}</TableCell>
                <TableCell align='center'>
                  <Stack direction='row' spacing={1} justifyContent='center'>
                    <IconButton color='primary' onClick={() => handleEdit(s)}>
                      <Edit size={18} />
                    </IconButton>
                    <IconButton color='error' onClick={() => handleDelete(s.id)}>
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
      { <FormShipper
        open={openForm}
        onClose={() => setOpenForm(false)}
        shipperToEdit={shipperToEdit}
        onSave={() => fetchShippers(page)}
      /> }
    </Box>
  );
}
