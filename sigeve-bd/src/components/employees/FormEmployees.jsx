import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Avatar } from '@mui/material';
import { employeesApi } from '../../services/api';

export default function FormEmployees({ open, onClose, employeeToEdit, onSave }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    title: '',
    country: '',
    city: '',
    homePhone: '',
    photo: null // base64
  });

  const [previewPhoto, setPreviewPhoto] = useState(null);

  // ==========================================
  // CARGAR DATOS AL EDITAR
  // ==========================================
  useEffect(() => {
    if (employeeToEdit) {
      setForm(employeeToEdit);
      if (employeeToEdit.photo) {
        setPreviewPhoto(`data:image/jpeg;base64,${employeeToEdit.photo}`);
      }
    } else {
      setForm({
        firstName: '',
        lastName: '',
        title: '',
        country: '',
        city: '',
        homePhone: '',
        photo: null
      });
      setPreviewPhoto(null);
    }
  }, [employeeToEdit]);

  // ==========================================
  // MANEJAR INPUTS
  // ==========================================
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================================
  // MANEJAR SUBIDA DE FOTO
  // ==========================================
  const handlePhotoUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setForm({ ...form, photo: base64 });
      setPreviewPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // GUARDAR / ACTUALIZAR
  // ==========================================
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (employeeToEdit) {
        await employeesApi.update(employeeToEdit.employeeId, form);
      } else {
        await employeesApi.create(form);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      PaperProps={{
        sx: { borderRadius: 3, p: 2, minWidth: 420, background: '#fff' }
      }}
    >
      <DialogTitle>{employeeToEdit ? 'Editar Empleado' : 'Agregar Empleado'}</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* FOTO */}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Avatar src={previewPhoto} sx={{ width: 90, height: 90, margin: '0 auto', mb: 1 }} />
              <Button variant='contained' component='label' size='small'>
                Subir foto
                <input type='file' hidden accept='image/*' onChange={handlePhotoUpload} />
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='firstName'
                label='Nombre'
                value={form.firstName}
                onChange={handleChange}
                required
                margin='dense'
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='lastName'
                label='Apellido'
                value={form.lastName}
                onChange={handleChange}
                required
                margin='dense'
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name='title'
                label='Cargo'
                value={form.title}
                onChange={handleChange}
                margin='dense'
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='city'
                label='Ciudad'
                value={form.city}
                onChange={handleChange}
                margin='dense'
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name='country'
                label='País'
                value={form.country}
                onChange={handleChange}
                margin='dense'
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name='homePhone'
                label='Teléfono'
                value={form.homePhone}
                onChange={handleChange}
                margin='dense'
              />
            </Grid>

            {/* BOTÓN GUARDAR */}
            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 2
                }}
              >
                {employeeToEdit ? 'Actualizar' : 'Guardar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', pr: 3 }}>
        <Button onClick={onClose} color='inherit'>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
