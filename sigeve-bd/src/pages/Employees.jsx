import React, { useEffect, useState, useCallback } from 'react';
import { employeesApi } from '../services/api';
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
  Button,
  IconButton,
  Stack
} from '@mui/material';
import { Edit, Trash } from 'lucide-react';
import FormEmployees from '../components/employees/FormEmployees';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  // ============================
  // CARGAR EMPLEADOS
  // ============================
  const fetchEmployees = useCallback(
    async (pageNum = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await employeesApi.getAll(pageNum, size);
        const data = response.data || {};

        setEmployees(data.content || []);
        setTotalElements(data.totalElements ?? 0);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los empleados');
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchEmployees(page, rowsPerPage);
  }, [fetchEmployees, page, rowsPerPage]);

  // ============================
  // PAGINACIÓN
  // ============================
  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  // ============================
  // CRUD
  // ============================
  const handleNew = () => {
    setEmployeeToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = emp => {
    setEmployeeToEdit(emp);
    setOpenForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que deseas eliminar este empleado?')) {
      try {
        await employeesApi.remove(id);
        fetchEmployees(page);
      } catch (err) {
        console.error('Error al eliminar empleado:', err);
      }
    }
  };

  // ============================
  // LOADING / ERROR
  // ============================
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

  // ============================
  // UI PRINCIPAL
  // ============================
  return (
    <Box p={3}>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5'>Listado de Empleados</Typography>
          <Button variant='contained' color='primary' onClick={handleNew}>
            Agregar Empleado
          </Button>
        </Box>
      </Paper>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Nombre</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Cargo</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Ciudad</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>País</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Teléfono</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>Foto</TableCell>
              <TableCell align='center' sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', border: 0 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map(emp => (
              <TableRow
                key={emp.employeeId}
                sx={{
                  transition: 'background 0.2s',
                  '&:hover': { background: '#f0f6ff' }
                }}
              >
                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  {emp.firstName} {emp.lastName}
                </TableCell>

                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{emp.title || '—'}</TableCell>

                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{emp.city || '—'}</TableCell>

                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{emp.country || '—'}</TableCell>

                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>{emp.homePhone || '—'}</TableCell>

                <TableCell sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  {emp.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${emp.photo}`}
                      alt='Foto'
                      style={{
                        width: 55,
                        height: 55,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        boxShadow: '0px 3px 8px rgba(0,0,0,0.2)'
                      }}
                    />
                  ) : (
                    'Sin foto'
                  )}
                </TableCell>

                <TableCell align='center' sx={{ borderBottom: '1px solid #e0e0e0' }}>
                  <Stack direction='row' spacing={1} justifyContent='center'>
                    <IconButton color='primary' onClick={() => handleEdit(emp)}>
                      <Edit size={18} />
                    </IconButton>

                    <IconButton color='error' onClick={() => handleDelete(emp.employeeId)}>
                      <Trash size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINACIÓN */}
        <TablePagination
          component='div'
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
        />
      </TableContainer>

      {/* MODAL */}
      <FormEmployees
        open={openForm}
        onClose={() => setOpenForm(false)}
        employeeToEdit={employeeToEdit}
        onSave={() => fetchEmployees(page)}
      />
    </Box>
  );
}
