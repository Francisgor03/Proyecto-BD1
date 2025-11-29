import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { shipperApi } from "../../services/api";

export default function FormShipper({ open, onClose, shipperToEdit, onSave }) {
  const [form, setForm] = useState({
    companyName: "",
    phone: "",
  });

  useEffect(() => {
    if (shipperToEdit) {
      setForm(shipperToEdit);
    } else {
      setForm({
        companyName: "",
        phone: "",
      });
    }
  }, [shipperToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (shipperToEdit) {
        await shipperApi.update(shipperToEdit.id, form);
      } else {
        await shipperApi.create(form);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error al guardar el remitente:", error);
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
        {shipperToEdit ? "Editar Remitente" : "Agregar Remitente"}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              maxWidth: 450,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
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
              name="phone"
              label="Teléfono"
              value={form.phone}
              onChange={handleChange}
              margin="dense"
            />

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
              {shipperToEdit ? "Actualizar" : "Guardar"}
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
