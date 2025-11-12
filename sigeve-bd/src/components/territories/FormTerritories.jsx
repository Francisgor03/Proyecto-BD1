import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { territoryApi } from '../../services/api';

export default function FormTerritories({ open, onClose, territoryToEdit, onSave }) {
  const [form, setForm] = useState({
    territoryID: '',
    territoryDescription: '',
    regionID: ''
  });

  useEffect(() => {
    if (territoryToEdit) {
      setForm({
        territoryID: territoryToEdit.territoryID || '',
        territoryDescription: territoryToEdit.territoryDescription || '',
        regionID: territoryToEdit.regionID || ''
      });
    } else {
      setForm({
        territoryID: '',
        territoryDescription: '',
        regionID: ''
      });
    }
  }, [territoryToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (territoryToEdit) {
        await territoryApi.update(form.territoryID, form);
      } else {
        await territoryApi.create(form);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar el territorio:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>{territoryToEdit ? 'Editar Territorio' : 'Agregar Territorio'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='territoryID'
                label='ID del Territorio'
                value={form.territoryID}
                onChange={handleChange}
                required
                disabled={!!territoryToEdit} // Bloquear el ID si estás editando
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name='territoryDescription'
                label='Descripción del Territorio'
                value={form.territoryDescription}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='regionID'
                label='ID de la Región'
                value={form.regionID}
                onChange={handleChange}
                required
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
          {territoryToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
