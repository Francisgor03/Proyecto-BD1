import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { orderDetailsApi } from '../../services/api';
export default function FormOrderDetail({ 
  open, 
  onClose, 
  orderId, 
  orderDetailToEdit, 
  onSave 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    unitPrice: '',
    quantity: '',
    discount: ''
  });

  useEffect(() => {
    if (orderDetailToEdit) {
      // edit
      setFormData({
        productId: orderDetailToEdit.productId.toString(),
        unitPrice: orderDetailToEdit.unitPrice.toString(),
        quantity: orderDetailToEdit.quantity.toString(),
        discount: (orderDetailToEdit.discount * 100).toString() // Convertir a porcentaje
      });
    } else {
      // insert
      setFormData({
        productId: '',
        unitPrice: '',
        quantity: '',
        discount: '0'
      });
    }
    setError('');
  }, [orderDetailToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.productId || !formData.unitPrice || !formData.quantity) {
        setError('Todos los campos son requeridos');
        return;
      }

      const orderDetailData = {
        orderId: parseInt(orderId),
        productId: parseInt(formData.productId),
        unitPrice: parseFloat(formData.unitPrice),
        quantity: parseInt(formData.quantity),
        discount: parseFloat(formData.discount || 0) / 100
      };

      if (orderDetailToEdit) {
        // cambiar guion
        const detailId = `${orderId}-${orderDetailToEdit.productId}`;
        await orderDetailsApi.update(detailId, orderDetailData);
      } else {
        // Modo inserción
        await orderDetailsApi.create(orderDetailData);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Error al guardar el detalle:', err);
      setError('Error al guardar el detalle. Verifique los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {orderDetailToEdit ? 'Editar Detalle de Orden' : 'Agregar Detalle a la Orden'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Product ID *"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              type="number"
              fullWidth
              disabled={!!orderDetailToEdit} // 
            />
            <TextField
              label="Precio Unitario *"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              fullWidth
            />
            <TextField
              label="Cantidad *"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: "1" }}
              fullWidth
            />
            <TextField
              label="Descuento (%)"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "100" }}
              fullWidth
              helperText="Ejemplo: 10 para 10% de descuento"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {orderDetailToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}