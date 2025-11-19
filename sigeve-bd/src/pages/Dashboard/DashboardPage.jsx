import React, { useEffect, useState } from 'react';
import { ventasCategoriaApi } from '../../services/api';
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

export default function DashboardPage() {
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

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const datosPaginados = datos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const chartData = datos.map((row, index) => ({
    id: index,
    value: row.totalUnidadesVendidas,
    label: row.nombreCategoria
  }));

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='70vh'>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'stretch'
      }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
          flex: 3,
          minWidth: { xs: '100%', md: '450px' },
          maxWidth: '700px',
          height: 450,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant='h5' gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
          Ventas por Categoría
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PieChart
            series={[
              {
                data: chartData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 40, additionalRadius: -40, color: 'gray' },
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
                outerRadius: 160
              }
            ]}
            height={350}
            width={350}
            slotProps={{
              legend: { hidden: true }
            }}
          />
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          flex: 1,
          minWidth: { xs: '100%', md: '300px' },
          maxWidth: '350px',
          height: 450,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Table size='small' sx={{ flex: 1 }}>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
              {['Cat', 'Ped', 'Und', 'Prom'].map(title => (
                <TableCell
                  key={title}
                  align='center'
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    padding: '6px',
                    fontSize: '.8rem'
                  }}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {datosPaginados.map((row, index) => (
              <TableRow key={index} sx={{ transition: '0.2s', '&:hover': { background: '#f0f6ff' } }}>
                <TableCell sx={{ padding: '6px', fontSize: '.8rem' }}>{row.nombreCategoria}</TableCell>
                <TableCell align='center' sx={{ padding: '6px', fontSize: '.8rem' }}>
                  {row.totalPedidos}
                </TableCell>
                <TableCell align='center' sx={{ padding: '6px', fontSize: '.8rem' }}>
                  {row.totalUnidadesVendidas}
                </TableCell>
                <TableCell align='center' sx={{ padding: '6px', fontSize: '.8rem' }}>
                  ${row.precioPromedioVenta?.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component='div'
          count={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage='Filas por página:'
        />
      </TableContainer>
    </Box>
  );
}