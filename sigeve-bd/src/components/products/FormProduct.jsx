import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { productApi } from '../../services/api';
export default function FormProduct({ open, onClose, productToEdit, onSave }) {
  const [form, setForm] = useState({
    productName: '',
    supplierId: '',
    categoryId: '',
    quantityPerUnit: '',
    unitPrice: '',
    unitsInStock: '',
    unitsOnOrder: '',
    reorderLevel: '',
    discontinued: false,
  });

  useEffect(() => {
    if (productToEdit) {
      setForm(productToEdit);
    } else {
      setForm({
        productName: '',
        supplierId: '',
        categoryId: '',
        quantityPerUnit: '',
        unitPrice: '',
        unitsInStock: '',
        unitsOnOrder: '',
        reorderLevel: '',
        discontinued: false,
      });
    }
  }, [productToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (productToEdit) {
        await productApi.update(productToEdit.id, form);
      } else {
        await productApi.create(form); 
      }
      onSave(); 
      onClose();
    } catch (error) {
      console.error('Error al guardar la orden:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='productName'
                label='Nombre del Producto'
                value={form.productName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='supplierId'
                label='ID del Proveedor'
                value={form.supplierId}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='categoryId'
                label='ID de la Categoría'
                value={form.categoryId}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='quantityPerUnit'
                label='Cantidad por Unidad'
                value={form.quantityPerUnit}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='unitPrice'
                label='Precio por Unidad'
                value={form.unitPrice}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='unitsInStock'
                label='Unidades en Stock'
                value={form.unitsInStock}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='unitsOnOrder'
                label='Unidades en Pedido'
                value={form.unitsOnOrder}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='reorderLevel'
                label='Nivel de Reorden'
                value={form.reorderLevel}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} display='flex' alignItems='center'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.discontinued}
                    onChange={e => setForm({ ...form, discontinued: e.target.checked })}
                    color='primary'
                  />
                }
                label='Descontinuado'
              />
            </Grid>

          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {productToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}