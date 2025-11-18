import React, { useEffect, useState } from 'react';
import { regionApi } from '../services/api';
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
  Pagination,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import { Edit, Trash } from 'lucide-react';
import FormRegion from '../components/Region/FormRegion';

export default function Regions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [regionToEdit, setRegionToEdit] = useState(null);

  const fetchRegions = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await regionApi.getAll(pageNum, 10);
      setRegions(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las regiones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleNew = () => {
    setRegionToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = region => {
    setRegionToEdit(region);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar esta región?')) {
      try {
        await regionApi.remove(id);
        fetchRegions(page);
      } catch (err) {
        console.error('Error al eliminar región:', err);
      }
    }
  };

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
    <Box p={3}>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5">Listado de Regiones</Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <Button variant="contained" color="primary" onClick={handleNew}>
              Nueva Región
            </Button>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>ID Región</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Descripción</TableCell>
              <TableCell align='center' sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {regions.map(r => (
              <TableRow key={r.id} sx={{ transition: "background 0.2s", "&:hover": { background: "#f0f6ff" } }}>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{r.id}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{r.regionDescription}</TableCell>
                <TableCell align='center' sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  <Stack direction='row' spacing={1} justifyContent='center'>
                    <IconButton color='primary' onClick={() => handleEdit(r)}>
                      <Edit size={18} />
                    </IconButton>
                    <IconButton color='error' onClick={() => handleDelete(r.id)}>
                      <Trash size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display='flex' justifyContent='center' mt={2}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handlePageChange}
          color='primary'
          shape='rounded'
        />
      </Box>

      {/* 🔹 Modal de Formulario */}
      <FormRegion
        open={openForm}
        onClose={() => setOpenForm(false)}
        regionToEdit={regionToEdit}
        onSave={() => fetchRegions(page)}
      />
    </Box>
  );
}
