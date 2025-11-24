import React, { useEffect, useState, useCallback } from "react";
import { shipperApi } from "../services/api";
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
  Stack,
} from "@mui/material";
import { Edit, Trash } from "lucide-react";
import FormShipper from "../components/shippers/FormShipper";

export default function Shippers() {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [openForm, setOpenForm] = useState(false);
  const [shipperToEdit, setShipperToEdit] = useState(null);

  const fetchShippers = useCallback(
    async (pageNum = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await shipperApi.getAll(pageNum, size);
        const data = response.data || {};
        setShippers(data.content || []);
        // intenta usar totalElements si tu API lo devuelve, si no calcula a partir de totalPages
        setTotalElements(data.totalElements ?? (data.totalPages ?? 0) * size);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los remitentes");
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchShippers(page, rowsPerPage);
  }, [fetchShippers, page, rowsPerPage]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleNew = () => {
    setShipperToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = (shipper) => {
    setShipperToEdit(shipper);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este remitente?")) {
      try {
        await shipperApi.remove(id);
        // refetch current page (si quedó vacío, podrías bajar page — opcional)
        fetchShippers(page, rowsPerPage);
      } catch (err) {
        console.error("Error al eliminar remitente:", err);
      }
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
      {/* Topbar */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Lista de Remitentes</Typography>

          <Button variant="contained" color="primary" onClick={handleNew}>
            Agregar Remitente
          </Button>
        </Box>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700, border: 0 }}>Compañía</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, border: 0 }}>Teléfono</TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: 700, border: 0 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {shippers.map((s) => (
              <TableRow
                key={s.shipperID ?? s.id}
                sx={{
                  transition: "background 0.2s",
                  "&:hover": { background: "#f0f6ff" },
                }}
              >
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{s.companyName}</TableCell>
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{s.phone}</TableCell>

                <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton color="primary" onClick={() => handleEdit(s)}>
                      <Edit size={18} />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(s.shipperID ?? s.id)}>
                      <Trash size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10]}
        />
      </TableContainer>

      {/* Modal */}
      <FormShipper
        open={openForm}
        onClose={() => setOpenForm(false)}
        shipperToEdit={shipperToEdit}
        onSave={() => fetchShippers(page, rowsPerPage)}
      />
    </Box>
  );
}
