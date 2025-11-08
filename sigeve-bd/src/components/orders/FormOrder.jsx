import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { orderApi } from '../../services/api';
export default function FormOrder({ open, onClose, orderToEdit, onSave }) {
  const [form, setForm] = useState({
    customerID: '',
    employeeID: '',
    orderDate: '',
    requiredDate: '',
    shippedDate: '',
    shipVia: '',
    freight: '',
    shipName: '',
    shipAddress: '',
    shipCity: '',
    shipRegion: '',
    shipPostalCode: '',
    shipCountry: '',
  });

  // 🔹 Cargar datos al editar
  useEffect(() => {
    if (orderToEdit) {
      setForm(orderToEdit);
    } else {
      setForm({
        customerID: '',
        employeeID: '',
        orderDate: '',
        requiredDate: '',
        shippedDate: '',
        shipVia: '',
        freight: '',
        shipName: '',
        shipAddress: '',
        shipCity: '',
        shipRegion: '',
        shipPostalCode: '',
        shipCountry: '',
      });
    }
  }, [orderToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (orderToEdit) {
        await orderApi.update(orderToEdit.id, form); // seguimos usando el ID interno para editar
      } else {
        await orderApi.create(form); // el backend generará el ID automáticamente
      }
      onSave(); // 🔄 para refrescar la tabla o lista de clientes
      onClose();
    } catch (error) {
      console.error('Error al guardar la orden:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{orderToEdit ? 'Editar Orden' : 'Agregar Orden'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='customerID'
                label='ID del Cliente'
                value={form.customerID}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='employeeID'
                label='ID del Empleado'
                value={form.employeeID}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='orderDate'
                label='Fecha de Orden'
                value={form.orderDate}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='requiredDate'
                label='Fecha Requerida'
                value={form.requiredDate}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='shippedDate'
                label='Fecha de Envío'
                value={form.shippedDate}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='shipVia'
                label='Método de Envío'
                value={form.shipVia}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='freight'
                label='Costo de Envío'
                value={form.freight}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='shipName'
                label='Nombre del destinatario'
                value={form.shipName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='shipAddress'
                label='Dirección de envío'
                value={form.shipAddress}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='shipCity' label='Ciudad' value={form.shipCity} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='shipRegion' label='Región' value={form.shipRegion} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='shipPostalCode' label='Código Postal' value={form.shipPostalCode} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='shipCountry'
                label='País de Envío'
                value={form.shipCountry}
                onChange={handleChange}
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
          {orderToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
