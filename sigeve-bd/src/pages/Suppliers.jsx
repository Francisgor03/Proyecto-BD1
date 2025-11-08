import React, { useEffect, useState } from 'react';
import { supplierApi } from '../services/api';
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
import FormSupplier from '../components/suppliers/FormSupplier';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  const fetchSuppliers = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await supplierApi.getAll(pageNum, 10);
      setSuppliers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleNew = () => {
    setSupplierToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = supplier => {
    setSupplierToEdit(supplier);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar este proveedor?')) {
      try {
        await supplierApi.remove(id);
        fetchSuppliers(page);
      } catch (err) {
        console.error('Error al eliminar este proveedor:', err);
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
        <Typography variant='h5'>Lista de Proveedores</Typography>
        <Button variant='contained' color='primary' onClick={handleNew}>
          Nuevo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Proveedor</TableCell>
              <TableCell>Nombre de Compania</TableCell>
              <TableCell>Nombre de Contacto</TableCell>
              <TableCell>Titulo de Contacto</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Codigo Postal</TableCell>
              <TableCell>Pais</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Fax</TableCell>
              <TableCell>Pagina de Inicio</TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.companyName}</TableCell>
                <TableCell>{s.contactName}</TableCell>
                <TableCell>{s.contactTitle}</TableCell>
                <TableCell>{s.address}</TableCell>
                <TableCell>{s.city}</TableCell>
                <TableCell>{s.region}</TableCell>
                <TableCell>{s.postalCode}</TableCell>
                <TableCell>{s.country}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.fax}</TableCell>
                <TableCell>{s.homepage}</TableCell>
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

      {/* Modal de Formulario */}
      <FormSupplier
        open={openForm}
        onClose={() => setOpenForm(false)}
        supplierToEdit={supplierToEdit}
        onSave={() => fetchSuppliers(page)}
      />
    </Box>
  );
}
