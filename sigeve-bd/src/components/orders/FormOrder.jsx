import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { orderApi } from "../../services/api";

export default function FormOrder({ open, onClose, orderToEdit, onSave }) {
  const [form, setForm] = useState({
    customerID: "",
    employeeID: "",
    orderDate: "",
    requiredDate: "",
    shippedDate: "",
    shipVia: "",
    freight: "",
    shipName: "",
    shipAddress: "",
    shipCity: "",
    shipRegion: "",
    shipPostalCode: "",
    shipCountry: "",
  });

  useEffect(() => {
    if (orderToEdit) {
      setForm(orderToEdit);
    } else {
      setForm({
        customerID: "",
        employeeID: "",
        orderDate: "",
        requiredDate: "",
        shippedDate: "",
        shipVia: "",
        freight: "",
        shipName: "",
        shipAddress: "",
        shipCity: "",
        shipRegion: "",
        shipPostalCode: "",
        shipCountry: "",
      });
    }
  }, [orderToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (orderToEdit) {
        await orderApi.update(orderToEdit.id, form); // seguimos usando el ID interno para editar
      } else {
        await orderApi.create(form); // el backend generará el ID automáticamente
      }
      onSave(); // para refrescar la tabla o lista de clientes
      onClose();
    } catch (error) {
      console.error("Error al guardar la orden:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 400, background: '#fff' } }}>
      <DialogTitle>
        {orderToEdit ? "Editar Orden" : "Agregar Orden"}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
            <TextField
              fullWidth
              name="customerID"
              label="ID del Cliente *"
              value={form.customerID}
              onChange={handleChange}
              required
              margin="dense"
            />
            <TextField
              fullWidth
              name="employeeID"
              label="ID del Empleado *"
              value={form.employeeID}
              onChange={handleChange}
              required
              margin="dense"
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TextField
                fullWidth
                name="orderDate"
                label="Fecha de Orden *"
                value={form.orderDate}
                onChange={handleChange}
                required
                margin="dense"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                name="requiredDate"
                label="Fecha Requerida *"
                value={form.requiredDate}
                onChange={handleChange}
                required
                margin="dense"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TextField
                fullWidth
                name="shippedDate"
                label="Fecha de Envío *"
                value={form.shippedDate}
                onChange={handleChange}
                required
                margin="dense"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                name="shipVia"
                label="Método de Envío *"
                value={form.shipVia}
                onChange={handleChange}
                required
                margin="dense"
              />
            </div>
            <TextField
              fullWidth
              name="freight"
              label="Costo de Envío *"
              value={form.freight}
              onChange={handleChange}
              required
              margin="dense"
              type="number"
            />
            <TextField
              fullWidth
              name="shipName"
              label="Nombre del destinatario"
              value={form.shipName}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              name="shipAddress"
              label="Dirección de envío"
              value={form.shipAddress}
              onChange={handleChange}
              margin="dense"
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TextField
                fullWidth
                name="shipCity"
                label="Ciudad"
                value={form.shipCity}
                onChange={handleChange}
                margin="dense"
              />
              <TextField
                fullWidth
                name="shipRegion"
                label="Región"
                value={form.shipRegion}
                onChange={handleChange}
                margin="dense"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TextField
                fullWidth
                name="shipPostalCode"
                label="Código Postal"
                value={form.shipPostalCode}
                onChange={handleChange}
                margin="dense"
              />
              <TextField
                fullWidth
                name="shipCountry"
                label="País de Envío"
                value={form.shipCountry}
                onChange={handleChange}
                margin="dense"
              />
            </div>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 700, fontSize: '1rem', borderRadius: 2 }}>
              {orderToEdit ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', pr: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}