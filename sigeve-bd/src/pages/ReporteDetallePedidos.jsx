import React, { useEffect, useState } from 'react';
import { reportesApi } from '../services/api';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';

export default function ReporteDetallePedidos() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await reportesApi.getDetallePedidos();
      setDatos(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5">Reporte: Detalle de Pedidos</Typography>
            <Typography variant="body2" color="text.secondary">
              Vista completa de pedidos con productos y totales
            </Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>ID Pedido</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Fecha</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Cliente</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Ciudad</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Producto</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Categoría</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Cantidad</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Precio Unit.</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Descuento</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Total Línea</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((row, index) => (
              <TableRow key={index} sx={{ transition: "background 0.2s", "&:hover": { background: "#f0f6ff" } }}>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.idPedido}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.fechaPedido}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.cliente}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.ciudad}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.producto}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.categoria}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.cantidad}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>${row.precioUnitario?.toFixed(2)}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{(row.descuento * 100).toFixed(0)}%</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0", fontWeight: 700 }}>${row.totalLinea?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}