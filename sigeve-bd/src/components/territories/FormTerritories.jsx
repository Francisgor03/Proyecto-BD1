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
    id: '',
    territoryDescription: '',
    regionId: ''
  });

  useEffect(() => {
    if (territoryToEdit) {
      setForm({
        id: territoryToEdit.id || '',
        territoryDescription: territoryToEdit.territoryDescription || '',
        regionId: territoryToEdit.regionId || ''
      });
    } else {
      setForm({
        id: '',
        territoryDescription: '',
        regionId: ''
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
        await territoryApi.update(form.id, form);
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
            {territoryToEdit && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name='id'
                  label='ID del Territorio'
                  value={form.id}
                  onChange={handleChange}
                  required
                  disabled
                />
              </Grid>
            )}

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
                name='regionId'
                label='ID de la Región'
                value={form.regionId}
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

