import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { productApi } from "../../services/api";

export default function FormProduct({ open, onClose, productToEdit, onSave }) {
  const [form, setForm] = useState({
    productName: "",
    supplierId: "",
    categoryId: "",
    quantityPerUnit: "",
    unitPrice: "",
    unitsInStock: "",
    unitsOnOrder: "",
    reorderLevel: "",
    discontinued: false,
  });

  useEffect(() => {
    if (productToEdit) {
      setForm(productToEdit);
    } else {
      setForm({
        productName: "",
        supplierId: "",
        categoryId: "",
        quantityPerUnit: "",
        unitPrice: "",
        unitsInStock: "",
        unitsOnOrder: "",
        reorderLevel: "",
        discontinued: false,
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productToEdit) {
        await productApi.update(productToEdit.id, form);
      } else {
        await productApi.create(form);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
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
        {productToEdit ? "Editar Producto" : "Agregar Producto"}
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
            {/* Nombre */}
            <TextField
              fullWidth
              name="productName"
              label="Nombre del Producto *"
              value={form.productName}
              onChange={handleChange}
              required
              margin="dense"
            />

            {/* Proveedor / Categoría */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="supplierId"
                label="ID Proveedor *"
                value={form.supplierId}
                onChange={handleChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                name="categoryId"
                label="ID Categoría *"
                value={form.categoryId}
                onChange={handleChange}
                required
                margin="dense"
              />
            </div>

            {/* Cantidad por unidad */}
            <TextField
              fullWidth
              name="quantityPerUnit"
              label="Cantidad por Unidad *"
              value={form.quantityPerUnit}
              onChange={handleChange}
              required
              margin="dense"
            />

            {/* Precio / Stock */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="unitPrice"
                label="Precio por Unidad *"
                type="number"
                value={form.unitPrice}
                onChange={handleChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                name="unitsInStock"
                label="Unidades en Stock *"
                type="number"
                value={form.unitsInStock}
                onChange={handleChange}
                required
                margin="dense"
              />
            </div>

            {/* En pedido / Reorden */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <TextField
                fullWidth
                name="unitsOnOrder"
                label="Unidades en Pedido *"
                type="number"
                value={form.unitsOnOrder}
                onChange={handleChange}
                required
                margin="dense"
              />
              <TextField
                fullWidth
                name="reorderLevel"
                label="Nivel de Reorden *"
                type="number"
                value={form.reorderLevel}
                onChange={handleChange}
                required
                margin="dense"
              />
            </div>

            {/* Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.discontinued}
                  onChange={(e) =>
                    setForm({ ...form, discontinued: e.target.checked })
                  }
                />
              }
              label="Descontinuado"
            />

            {/* Botón */}
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
              {productToEdit ? "Actualizar" : "Guardar"}
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
