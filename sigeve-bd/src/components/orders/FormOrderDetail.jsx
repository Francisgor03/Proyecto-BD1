import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete
} from '@mui/material';

import { productApi, orderDetailsApi } from '../../services/api';
import { useAlert } from '../../utils/useAlert';

export default function FormOrderDetail({ open, onClose, orderId, onSave }) {
  const showAlert = useAlert(); // ⬅️ AQUI USAS EL HOOK GLOBAL

  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    productId: '',
    unitPrice: '',
    quantity: '1',
    discount: '0'
  });

  // Reset + carga productos
  useEffect(() => {
    if (open) {
      resetForm();
      loadProducts();
    }
  }, [open]);

  const resetForm = () => {
    setForm({ productId: '', unitPrice: '', quantity: '1', discount: '0' });
    setSelectedProduct(null);
    setError('');
  };

  const loadProducts = async () => {
    setProductLoading(true);
    try {
      const { data } = await productApi.getAll(0, 1000);
      setProducts(data?.content || []);
    } catch {
      setProducts([]);
      setError('Error cargando productos');
    } finally {
      setProductLoading(false);
    }
  };

  const updateField = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const quantityOptions = () => {
    const max = selectedProduct?.unitsInStock ?? 5;
    return Array.from({ length: Math.min(max, 100) }, (_, i) => i + 1);
  };

  const handleSelectProduct = p => {
    setSelectedProduct(p);
    setForm(f => ({
      ...f,
      productId: p.id.toString(),
      unitPrice: p.unitPrice.toString()
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!form.productId || !form.unitPrice || !form.quantity) {
        setError('Todos los campos son requeridos');
        return;
      }

      const body = {
        orderId: Number(orderId),
        productId: Number(form.productId),
        unitPrice: Number(form.unitPrice),
        quantity: Number(form.quantity),
        discount: Number(form.discount) / 100
      };

      await orderDetailsApi.create(body);

      showAlert('Producto agregado correctamente', 'success'); 

      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error guardando detalle');
      showAlert('Error guardando detalle', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Agregar Producto</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* PRODUCTO */}
          <Autocomplete
            options={products}
            loading={productLoading}
            value={selectedProduct}
            onChange={(e, val) => (val ? handleSelectProduct(val) : resetForm())}
            getOptionLabel={p => (p ? `${p.productName} (ID: ${p.id})` : '')}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography fontWeight='bold'>{option.productName}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    ID {option.id} • ${option.unitPrice} • Stock {option.unitsInStock}
                  </Typography>
                </Box>
              </li>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label='Producto *'
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {productLoading && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />

          {/* PRECIO */}
          <TextField
            label='Precio Unitario *'
            name='unitPrice'
            value={form.unitPrice}
            onChange={updateField}
            type='number'
            required
            inputProps={{ min: 0, step: '0.01' }}
            fullWidth
          />

          {/* CANTIDAD */}
          <FormControl fullWidth required>
            <InputLabel>Cantidad *</InputLabel>
            <Select name='quantity' label='Cantidad *' value={form.quantity} onChange={updateField}>
              {quantityOptions().map(q => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* DESCUENTO */}
          <TextField
            label='Descuento (%)'
            name='discount'
            value={form.discount}
            onChange={updateField}
            type='number'
            inputProps={{ min: 0, max: 100, step: '0.1' }}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={loading || !selectedProduct}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
