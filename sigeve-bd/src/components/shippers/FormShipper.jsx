import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { shipperApi } from '../../services/api';

export default function FormShipper({ open, onClose, shipperToEdit, onSave }) {
  const [form, setForm] = useState({
    companyName: '',
    phone: '',

  });

  // 🔹 Cargar datos al editar
  useEffect(() => {
    if (shipperToEdit) {
      setForm(shipperToEdit);
    } else {
      setForm({
        companyName: '',
        phone: '',
      });
    }
  }, [shipperToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (shipperToEdit) {
        await shipperApi.update(shipperToEdit.id, form); // seguimos usando el ID interno para editar
      } else {
        await shipperApi.create(form); // el backend generará el ID automáticamente
      }
      onSave(); // 🔄 para refrescar la tabla o lista de remitentes
      onClose();
    } catch (error) {
      console.error('Error al guardar el remitente:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>{shipperToEdit ? 'Editar Remitente' : 'Agregar Remitente'}</DialogTitle>

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
              <TextField fullWidth name='phone' label='Teléfono' value={form.phone} onChange={handleChange} />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='inherit'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {shipperToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
