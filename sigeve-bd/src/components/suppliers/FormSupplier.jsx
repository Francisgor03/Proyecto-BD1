import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { supplierApi } from '../../services/api';
export default function FormSupplier({ open, onClose, supplierToEdit, onSave }) {
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
    fax: '',
    homepage: '',
  });

  useEffect(() => {
    if (supplierToEdit) {
      setForm(supplierToEdit);
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
        fax: '',
        homepage: '',
      });
    }
  }, [supplierToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (supplierToEdit) {
        await supplierApi.update(supplierToEdit.id, form); 
      } else {
        await supplierApi.create(form); 
      }
      onSave(); 
      onClose();
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{supplierToEdit ? 'Editar Proveedor' : 'Agregar Proveedor'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='companyName'
                label='Nombre de la Compañía'
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='contactName'
                label='Nombre de Contacto'
                value={form.contactName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='contactTitle'
                label='Título de Contacto'
                value={form.contactTitle}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='address'
                label='Dirección'
                value={form.address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='city'
                label='Ciudad'
                value={form.city}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='region'
                label='Región'
                value={form.region}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='postalCode'
                label='Código Postal'
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='country'
                label='País'
                value={form.country}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='phone'
                label='Teléfono'
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='fax' label='Fax' value={form.fax} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth name='homePage' label='Página de Inicio' value={form.homePage} onChange={handleChange} />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {supplierToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
