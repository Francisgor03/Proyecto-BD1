import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { territoryApi } from '../../services/api';

export default function FormTerritories({ open, onClose, territoryToEdit, onSave }) {
  const [form, setForm] = useState({
    id: '',
    territoryDescription: '',
    regionId: ''
  });

  // 🔹 Cargar datos al editar
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
      onSave(); // para refrescar la tabla
      onClose();
    } catch (error) {
      console.error('Error al guardar el territorio:', error);
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
        {territoryToEdit ? 'Editar Territorio' : 'Agregar Territorio'}
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
            {territoryToEdit && (
              <TextField
                fullWidth
                name="id"
                label="ID del Territorio"
                value={form.id}
                onChange={handleChange}
                required
                disabled
                margin="dense"
              />
            )}

            <TextField
              fullWidth
              name="territoryDescription"
              label="Descripción del Territorio *"
              value={form.territoryDescription}
              onChange={handleChange}
              required
              margin="dense"
            />

            <TextField
              fullWidth
              name="regionId"
              label="ID de la Región *"
              value={form.regionId}
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
              {territoryToEdit ? 'Actualizar' : 'Guardar'}
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