import React, { useEffect, useState, useCallback } from "react";
import { supplierApi } from "../services/api";
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
import FormSupplier from "../components/suppliers/FormSupplier";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const [openForm, setOpenForm] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  const fetchSuppliers = useCallback(
    async (pageNum = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await supplierApi.getAll(pageNum, size);

        const data = response.data || {};
        setSuppliers(data.content || []);
        setTotalElements(data.totalElements ?? (data.totalPages ?? 0) * size);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los proveedores");
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchSuppliers(page, rowsPerPage);
  }, [fetchSuppliers, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleNew = () => {
    setSupplierToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = (supplier) => {
    setSupplierToEdit(supplier);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      try {
        await supplierApi.remove(id);
        fetchSuppliers(page);
      } catch (err) {
        console.error("Error al eliminar proveedor:", err);
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
    <>
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Lista de Proveedores</Typography>
          <Button variant="contained" color="primary" onClick={handleNew}>
            Agregar Proveedor
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)",
              }}
            >
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Compañía
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Contacto
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Título de Contacto
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Dirección
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Ciudad
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Región
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Código Postal
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                País
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Fax
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}>
                Página Web
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0, whiteSpace: 'nowrap' }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {suppliers.map((s) => (
              <TableRow
                key={s.id}
                sx={{
                  transition: "background 0.2s",
                  "&:hover": { background: "#f0f6ff" },
                }}
              >
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.companyName}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.contactName}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.contactTitle}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.address}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.city}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.region}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.postalCode}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.country}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.phone}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.fax}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{s.homepage}</TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton color="primary" onClick={() => handleEdit(s)}>
                      <Edit size={18} />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(s.id)}>
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

      <FormSupplier
        open={openForm}
        onClose={() => setOpenForm(false)}
        supplierToEdit={supplierToEdit}
        onSave={() => fetchSuppliers(page)}
      />
    </>
  );
}
