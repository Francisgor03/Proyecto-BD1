import React, { useEffect, useState } from 'react';
import { ventasCategoriaApi } from '../services/api';
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
import { PieChart } from '@mui/x-charts/PieChart';

export default function ReporteVentasCategoria() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ventasCategoriaApi.getAll();
      const data = response.data || [];
      setDatos(data);
      setTotalElements(data.length);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const datosPaginados = datos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const chartData = datos.map((row, index) => ({
    id: index,
    value: row.totalUnidadesVendidas,
    label: row.nombreCategoria, 
  }));

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
    <Box p={3} sx={{ maxWidth: 1000, margin: '0 auto' }}>
      
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
          Dashboard de Ventas por Categoría
        </Typography>
      </Paper>

      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          Gráfico de Ventas por Categoría
        </Typography>
        
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              innerRadius: 30,
              paddingAngle: 1,
              cornerRadius: 3,
              outerRadius: 140,    
            },
          ]}
          height={350}
          width={500} 
          
          slotProps={{
            legend: { 
              hidden: true, 
              padding: 0     
            }, 
          }}
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)" }}>
              {["Categoría", "Total Pedidos", "Unidades Vendidas", "Precio Promedio"].map((title) => (
                <TableCell
                  key={title}
                  align={title === "Categoría" ? "left" : "center"}
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPaginados.map((row, index) => (
              <TableRow key={index} sx={{ transition: "0.2s", "&:hover": { background: "#f0f6ff" } }}>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0", fontWeight: 500 }}>
                  {row.nombreCategoria}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  {row.totalPedidos}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  {row.totalUnidadesVendidas}
                </TableCell>
                <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  ${row.precioPromedioVenta?.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>
    </Box>
  );
}