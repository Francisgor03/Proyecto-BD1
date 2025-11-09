import React, { useEffect, useState } from 'react';
import { categoryApi } from '../services/api';
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
import FormCategories from '../components/categories/FormCategories';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const fetchCategories = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll(pageNum, 10);
      setCategories(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleNew = () => {
    setCategoryToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = category => {
    setCategoryToEdit(category);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
      try {
        await categoryApi.remove(id);
        fetchCategories(page);
      } catch (err) {
        console.error('Error al eliminar la categoría:', err);
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
        <Typography variant='h5'>Lista de Categorías</Typography>
        <Button variant='contained' color='primary' onClick={handleNew}>
          Nueva Categoría
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.categoryID}>
                <TableCell>{cat.categoryName}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>
                  {cat.picture ? (
                    <img
                      src={cat.picture}
                      alt={cat.categoryName}
                      style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    'Sin imagen'
                  )}
                </TableCell>
                <TableCell align='center'>
                  <Stack direction='row' spacing={1} justifyContent='center'>
                    <IconButton color='primary' onClick={() => handleEdit(cat)}>
                      <Edit size={18} />
                    </IconButton>
                    <IconButton color='error' onClick={() => handleDelete(cat.categoryID)}>
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

      <FormCategories
        open={openForm}
        onClose={() => setOpenForm(false)}
        categoryToEdit={categoryToEdit}
        onSave={() => fetchCategories(page)}
      />
    </Box>
  );
}
