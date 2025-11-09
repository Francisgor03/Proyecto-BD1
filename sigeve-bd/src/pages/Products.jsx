import React, { useEffect, useState } from 'react';
import { productApi } from '../services/api';
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
import FormProduct from '../components/products/FormProduct';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await productApi.getAll(pageNum, 10);
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleNew = () => {
    setProductToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = product => {
    setProductToEdit(product);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await productApi.remove(id);
        fetchProducts(page);
      } catch (err) {
        console.error('Error al eliminar este producto:', err);
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
        <Typography variant='h5'>Lista de Productos</Typography>
        <Button variant='contained' color='primary' onClick={handleNew}>
          Nuevo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Producto</TableCell>
              <TableCell>Id de Proveedor</TableCell>
              <TableCell>Id de Categoría</TableCell>
              <TableCell>Cantidad por Unidad</TableCell>
              <TableCell>Precio por Unidad</TableCell>
              <TableCell>Unidades en Stock</TableCell>
              <TableCell>Unidades en Pedido</TableCell>
              <TableCell>Nivel de Reorden</TableCell>
              <TableCell>Descontinuado</TableCell>
              <TableCell align='center'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.productName}</TableCell>
                <TableCell>{p.supplierId}</TableCell>
                <TableCell>{p.categoryId}</TableCell>
                <TableCell>{p.quantityPerUnit}</TableCell>
                <TableCell>{p.unitPrice}</TableCell>
                <TableCell>{p.unitsInStock}</TableCell>
                <TableCell>{p.unitsOnOrder}</TableCell>
                <TableCell>{p.reorderLevel}</TableCell>
                <TableCell>{p.discontinued ? 'Sí' : 'No'}</TableCell>
                <TableCell align='center'>
                  <Stack direction='row' spacing={1} justifyContent='center'>
                    <IconButton color='primary' onClick={() => handleEdit(p)}>
                      <Edit size={18} />
                    </IconButton>
                    <IconButton color='error' onClick={() => handleDelete(p.id)}>
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
      <FormProduct
        open={openForm}
        onClose={() => setOpenForm(false)}
        productToEdit={productToEdit}
        onSave={() => fetchProducts(page)}
      />
    </Box>
  );
}
