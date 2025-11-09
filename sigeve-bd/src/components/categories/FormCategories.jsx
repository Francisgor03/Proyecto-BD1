import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { categoryApi } from '../../services/api';

export default function FormCategories({ open, onClose, categoryToEdit, onSave }) {
  const [form, setForm] = useState({
    categoryName: '',
    description: '',
    picture: ''
  });

  useEffect(() => {
    if (categoryToEdit) {
      setForm(categoryToEdit);
    } else {
      setForm({
        categoryName: '',
        description: '',
        picture: ''
      });
    }
  }, [categoryToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (categoryToEdit) {
        await categoryApi.update(categoryToEdit.categoryID, form); 
      } else {
        await categoryApi.create(form);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>{categoryToEdit ? 'Editar Categoría' : 'Agregar Categoría'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name='categoryName'
                label='Nombre de Categoría'
                value={form.categoryName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name='description'
                label='Descripción'
                value={form.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name='picture'
                label='URL o Ruta de Imagen'
                value={form.picture}
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
          {categoryToEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
