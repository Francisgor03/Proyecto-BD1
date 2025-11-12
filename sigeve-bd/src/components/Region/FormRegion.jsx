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
import { regionApi } from '../../services/api';

export default function FormRegion({ open, onClose, regionToEdit, onSave }) {
  const [form, setForm] = useState({
    id: '',
    regionDescription: ''
  });

  // Cargar datos si se va a editar
  useEffect(() => {
    if (regionToEdit) {
      setForm({
        id: regionToEdit.id,
        regionDescription: regionToEdit.regionDescription
      });
    } else {
      setForm({
        id: '',
        regionDescription: ''
      });
    }
  }, [regionToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (regionToEdit) {
        // Actualizar
        await regionApi.update(regionToEdit.id, {
          regionDescription: form.regionDescription
        });
      } else {
        // Crear
        await regionApi.create({
          id: form.id,
          regionDescription: form.regionDescription
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar la región:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{regionToEdit ? 'Editar Región' : 'Agregar Región'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="id"
                label="ID de la Región"
                value={form.id}
                onChange={handleChange}
                required
                disabled={!!regionToEdit} // no editable si estás editando
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="regionDescription"
                label="Descripción de la Región"
                value={form.regionDescription}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {regionToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
