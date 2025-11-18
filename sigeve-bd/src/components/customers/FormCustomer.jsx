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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, minWidth: 400, background: "#fff" },
      }}
    >
      <DialogTitle>
        {customerToEdit ? "Editar Cliente" : "Agregar Cliente"}
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
              name="companyName"
              label="Compañía *"
              value={form.companyName}
              onChange={handleChange}
              required
              margin="dense"
            />
            <TextField
              fullWidth
              name="contactName"
              label="Nombre de contacto *"
              value={form.contactName}
              onChange={handleChange}
              required
              margin="dense"
            />
            <TextField
              fullWidth
              name="contactTitle"
              label="Cargo"
              value={form.contactTitle}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              name="address"
              label="Dirección"
              value={form.address}
              onChange={handleChange}
              margin="dense"
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="city"
                label="Ciudad"
                value={form.city}
                onChange={handleChange}
                margin="dense"
              />
              <TextField
                fullWidth
                name="region"
                label="Región"
                value={form.region}
                onChange={handleChange}
                margin="dense"
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="postalCode"
                label="Código Postal"
                value={form.postalCode}
                onChange={handleChange}
                margin="dense"
              />
              <TextField
                fullWidth
                name="country"
                label="País"
                value={form.country}
                onChange={handleChange}
                margin="dense"
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="phone"
                label="Teléfono"
                value={form.phone}
                onChange={handleChange}
                margin="dense"
              />
              <TextField
                fullWidth
                name="fax"
                label="Fax"
                value={form.fax}
                onChange={handleChange}
                margin="dense"
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontWeight: 700, fontSize: "1rem", borderRadius: 2 }}
            >
              {customerToEdit ? "Actualizar" : "Guardar"}
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
