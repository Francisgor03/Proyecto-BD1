import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { categoryApi } from "../../services/api";

export default function FormCategories({ open, onClose, categoryToEdit, onSave }) {
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
    picture: "",
  });

  useEffect(() => {
    if (categoryToEdit) {
      setForm(categoryToEdit);
    } else {
      setForm({
        categoryName: "",
        description: "",
        picture: "",
      });
    }
  }, [categoryToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
      console.error("Error al guardar la categoría:", error);
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
        {categoryToEdit ? "Editar Categoría" : "Agregar Categoría"}
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
              name="categoryName"
              label="Nombre de la Categoría *"
              value={form.categoryName}
              onChange={handleChange}
              required
              margin="dense"
            />

            <TextField
              fullWidth
              name="description"
              label="Descripción"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              margin="dense"
            />

            <TextField
              fullWidth
              name="picture"
              label="URL de Imagen"
              value={form.picture}
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
              {categoryToEdit ? "Actualizar" : "Guardar"}
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
