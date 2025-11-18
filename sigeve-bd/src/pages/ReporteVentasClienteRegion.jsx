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
  TablePagination,
} from '@mui/material';

export default function ReporteVentasClienteRegion() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await reportesApi.getVentasClienteRegion();
      setDatos(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  // Datos paginados en el frontend
  const datosPaginados = datos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            <Typography variant="h5">Reporte: Ventas por Cliente y Región</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Resumen de ventas totales agrupadas por cliente
            </Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Cliente</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Contacto</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Ciudad</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Región</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>País</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Total Pedidos</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Total Vendido</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Promedio/Línea</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPaginados.map((row, index) => (
              <TableRow key={index} sx={{ transition: "background 0.2s", "&:hover": { background: "#f0f6ff" } }}>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.cliente}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.contacto}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.ciudad}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.region || 'N/A'}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.pais}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{row.totalPedidos}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0", fontWeight: 700, color: "#4caf50" }}>
                  ${row.totalVendido?.toFixed(2)}
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>${row.promedioLinea?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={datos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>
    </Box>
  );
}