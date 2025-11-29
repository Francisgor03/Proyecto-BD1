import React, { useEffect, useState, useCallback } from "react";
import { categoryApi } from "../services/api";
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
import FormCategories from "../components/categories/FormCategories";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const fetchCategories = useCallback(
    async (pageNum = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await categoryApi.getAll(pageNum, size);
        const data = response.data || {};

        setCategories(data.content || []);
        setTotalElements(data.totalElements ?? (data.totalPages ?? 0) * size);
      } catch (err) {
        console.error(err);
        setError("Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchCategories(page, rowsPerPage);
  }, [fetchCategories, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleNew = () => {
    setCategoryToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = (cat) => {
    setCategoryToEdit(cat);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta categoría?")) {
      try {
        await categoryApi.remove(id);
        fetchCategories(page);
      } catch (err) {
        console.error("Error al eliminar la categoría:", err);
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
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Listado de Categorías</Typography>
          <Button variant="contained" color="primary" onClick={handleNew}>
            Agregar Categoría
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)",
              }}
            >
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>
                Descripción
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}>
                Imagen
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem", border: 0 }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((cat) => (
              <TableRow
                key={cat.categoryID}
                sx={{
                  transition: "background 0.2s",
                  "&:hover": { background: "#f0f6ff" },
                }}
              >
                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  {cat.categoryName}
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  {cat.description}
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  {cat.picture ? (
                    <img
                      src={cat.picture}
                      alt={cat.categoryName}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
                      }}
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </TableCell>

                <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton color="primary" onClick={() => handleEdit(cat)}>
                      <Edit size={18} />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(cat.categoryID)}>
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
      <FormCategories
        open={openForm}
        onClose={() => setOpenForm(false)}
        categoryToEdit={categoryToEdit}
        onSave={() => fetchCategories(page)}
      />
    </Box>
  );
}
