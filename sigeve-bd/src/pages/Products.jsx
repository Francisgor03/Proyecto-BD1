import React, { useEffect, useState, useCallback } from "react";
import { productApi } from "../services/api";
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
} from "@mui/material";
import { Edit, Trash } from "lucide-react";
import FormProduct from "../components/products/FormProduct";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openForm, setOpenForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = useCallback(
    async (pageNum = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await productApi.getAll(pageNum, size);
        const data = response.data || {};

        setProducts(data.content || []);
        setTotalElements(data.totalElements ?? (data.totalPages ?? 0) * size);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchProducts(page, rowsPerPage);
  }, [fetchProducts, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleNew = () => {
    setProductToEdit(null);
    setOpenForm(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await productApi.remove(id);
        fetchProducts(page);
      } catch (err) {
        console.error("Error al eliminar producto:", err);
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
          <Typography variant="h5">Listado de Productos</Typography>

          <Button variant="contained" color="primary" onClick={handleNew}>
            Nuevo Producto
          </Button>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(90deg, #4f8cff 0%, #6ed6ff 100%)",
              }}
            >
              {[
                "Nombre",
                "Id Proveedor",
                "Id Categoría",
                "Cantidad por Unidad",
                "Precio Unidad",
                "Stock",
                "En Pedido",
                "Nivel Reorden",
                "Descontinuado",
                "Acciones",
              ].map((title) => (
                <TableCell
                  key={title}
                  align={title === "Acciones" ? "center" : "left"}
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    border: 0,
                  }}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow
                key={p.id}
                sx={{
                  transition: "0.2s",
                  "&:hover": { background: "#f4f9ff" },
                }}
              >
                <TableCell>{p.productName}</TableCell>
                <TableCell>{p.supplierId}</TableCell>
                <TableCell>{p.categoryId}</TableCell>
                <TableCell>{p.quantityPerUnit}</TableCell>
                <TableCell>{p.unitPrice}</TableCell>
                <TableCell>{p.unitsInStock}</TableCell>
                <TableCell>{p.unitsOnOrder}</TableCell>
                <TableCell>{p.reorderLevel}</TableCell>
                <TableCell>{p.discontinued ? "Sí" : "No"}</TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton color="primary" onClick={() => handleEdit(p)}>
                      <Edit size={18} />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(p.id)}>
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
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>

      {/* Modal para crear / editar */}
      <FormProduct
        open={openForm}
        onClose={() => setOpenForm(false)}
        productToEdit={productToEdit}
        onSave={() => fetchProducts(page)}
      />
    </Box>
  );
}
