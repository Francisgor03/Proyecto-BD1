import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { customerApi } from '../../services/api';

export default function FormCustomer({ open, onClose, customerToEdit, onSave }) {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    contactTitle: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    phone: '',
    fax: ''
  });

  // 🔹 Cargar datos al editar
  useEffect(() => {
    if (customerToEdit) {
      setForm(customerToEdit);
    } else {
      setForm({
        companyName: '',
        contactName: '',
        contactTitle: '',
        address: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
        phone: '',
        fax: ''
      });
    }
  }, [customerToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (customerToEdit) {
        await customerApi.update(customerToEdit.id, form); // seguimos usando el ID interno para editar
      } else {
        await customerApi.create(form); // el backend generará el ID automáticamente
      }
      onSave(); // 🔄 para refrescar la tabla o lista de clientes
      onClose();
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{customerToEdit ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='companyName'
                label='Compañía'
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='contactName'
                label='Nombre de contacto'
                value={form.contactName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='contactTitle'
                label='Cargo'
                value={form.contactTitle}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='address' label='Dirección' value={form.address} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='city' label='Ciudad' value={form.city} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='region' label='Región' value={form.region} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='postalCode'
                label='Código Postal'
                value={form.postalCode}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='country' label='País' value={form.country} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='phone' label='Teléfono' value={form.phone} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='fax' label='Fax' value={form.fax} onChange={handleChange} />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {customerToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
