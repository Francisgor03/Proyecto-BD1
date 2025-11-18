import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { regionApi } from '../../services/api';

export default function FormRegion({ open, onClose, regionToEdit, onSave }) {
  const [form, setForm] = useState({
    regionDescription: ''
  });

  // 🔹 Cargar datos al editar
  useEffect(() => {
    if (regionToEdit) {
      setForm({
        regionDescription: regionToEdit.regionDescription
      });
    } else {
      setForm({
        regionDescription: ''
      });
    }
  }, [regionToEdit]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (regionToEdit) {
        // Actualizar → aquí sí se usa el ID
        await regionApi.update(regionToEdit.id, {
          regionDescription: form.regionDescription
        });
      } else {
        // Crear → NO SE ENVÍA ID
        await regionApi.create({
          regionDescription: form.regionDescription
        });
      }
      onSave(); // para refrescar la tabla
      onClose();
    } catch (error) {
      console.error('Error al guardar la región:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, minWidth: 400, background: "#fff" },
      }}
    >
      <DialogTitle>
        {regionToEdit ? "Editar Región" : "Agregar Región"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              maxWidth: 500,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              marginTop: "0.5rem",
            }}
          >
            <TextField
              fullWidth
              name="regionDescription"
              label="Descripción de la Región *"
              value={form.regionDescription}
              onChange={handleChange}
              required
              margin="dense"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontWeight: 700, fontSize: "1rem", borderRadius: 2 }}
            >
              {regionToEdit ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", pr: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}