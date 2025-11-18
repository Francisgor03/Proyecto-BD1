import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { supplierApi } from "../../services/api";

export default function FormSupplier({
  open,
  onClose,
  supplierToEdit,
  onSave,
}) {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    contactTitle: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    phone: "",
    fax: "",
    homePage: "",
  });

  useEffect(() => {
    if (supplierToEdit) {
      setForm(supplierToEdit);
    } else {
      setForm({
        companyName: "",
        contactName: "",
        contactTitle: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
        phone: "",
        fax: "",
        homePage: "",
      });
    }
  }, [supplierToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
      console.error("Error al guardar el proveedor:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, minWidth: 450, background: "#fff" },
      }}
    >
      <DialogTitle>
        {supplierToEdit ? "Editar Proveedor" : "Agregar Proveedor"}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              maxWidth: 500,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              marginTop: "0.5rem",
            }}
          >
            {/* Empresa */}
            <TextField
              fullWidth
              name="companyName"
              label="Nombre de la Compañía *"
              value={form.companyName}
              onChange={handleChange}
              required
              margin="dense"
            />

            {/* Contacto */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="contactName"
                label="Nombre de Contacto *"
                value={form.contactName}
                onChange={handleChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                name="contactTitle"
                label="Título de Contacto *"
                value={form.contactTitle}
                onChange={handleChange}
                required
                margin="dense"
              />
            </div>

            {/* Dirección */}
            <TextField
              fullWidth
              name="address"
              label="Dirección *"
              value={form.address}
              onChange={handleChange}
              required
              margin="dense"
            />

            {/* Ciudad / Región */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="city"
                label="Ciudad *"
                value={form.city}
                onChange={handleChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                name="region"
                label="Región *"
                value={form.region}
                onChange={handleChange}
                required
                margin="dense"
              />
            </div>

            {/* Código Postal / País */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="postalCode"
                label="Código Postal *"
                value={form.postalCode}
                onChange={handleChange}
                required
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

            {/* Teléfono / Fax */}
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

            {/* Página Web */}
            <TextField
              fullWidth
              name="homePage"
              label="Página Web"
              value={form.homePage}
              onChange={handleChange}
              margin="dense"
            />

            {/* Botón Guardar */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: 2,
              }}
            >
              {supplierToEdit ? "Actualizar" : "Guardar"}
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
