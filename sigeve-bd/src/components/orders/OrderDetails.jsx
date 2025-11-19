import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { orderDetailsApi, orderApi } from '../../services/api';

export default function OrderDetails({ orderId, onOrderDetailDeleted, onOrderDeleted }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);

  useEffect(() => {
    if (open && orderId) cargarDetallesOrden();
  }, [open, orderId]);

  const cargarDetallesOrden = async () => {
    try {
      setLoading(true);
      const response = await orderDetailsApi.getByOrderId(orderId);
      setOrderDetails(response.data || []);
    } catch (e) {
      console.error('Error cargando detalles de orden:', e);
      setOrderDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = (detalles) => {
    return detalles.reduce((total, item) => {
      const precioConDescuento = item.unitPrice * (1 - item.discount);
      return total + (precioConDescuento * item.quantity);
    }, 0);
  };

  const calcularSubtotal = (item) => {
    const precioConDescuento = item.unitPrice * (1 - item.discount);
    return precioConDescuento * item.quantity;
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este producto de la orden?')) {
      return;
    }

    try {
      setDeleting(productId);
      await orderDetailsApi.deleteOrderDetail(orderId, productId);
      
      // Actualizar la lista local
      const updatedDetails = orderDetails.filter(item => item.productId !== productId);
      setOrderDetails(updatedDetails);
      
      // Notificar al componente padre si es necesario
      if (onOrderDetailDeleted) {
        onOrderDetailDeleted();
      }

      alert('Producto eliminado correctamente de la orden');
    } catch (error) {
      console.error('Error eliminando producto de la orden:', error);
      alert('Error al eliminar el producto de la orden');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      setDeletingOrder(true);
      await orderApi.remove(orderId.toString());
      
      // Notificar al componente padre
      if (onOrderDeleted) {
        onOrderDeleted();
      }
      
      setDeleteOrderDialog(false);
      setOpen(false);
      alert(`Orden ${orderId} eliminada correctamente`);
    } catch (error) {
      console.error('Error eliminando orden:', error);
      alert('Error al eliminar la orden');
    } finally {
      setDeletingOrder(false);
    }
  };

  return (
    <>
      {/* Botón para abrir el diálogo */}
      <Tooltip title="Ver detalles de la orden">
        <IconButton 
          color="primary" 
          onClick={() => setOpen(true)}
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>

      {/* Diálogo de detalles de la orden */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='lg'>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Detalles de la Orden: {orderId}
            </Typography>
            {orderDetails.length > 0 && (
              <Box display="flex" gap={2}>
                <Chip 
                  label={`${orderDetails.length} productos`} 
                  variant="outlined" 
                />
                <Chip 
                  label={`Total: $${calcularTotal(orderDetails)?.toFixed(2)}`} 
                  color="primary" 
                />
              </Box>
            )}
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            Desde aquí puede gestionar los productos de la orden.
          </Alert>

          {loading ? (
            <Box display='flex' justifyContent='center' alignItems='center' height={200}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell><b>Producto ID</b></TableCell>
                  <TableCell align="right"><b>Precio Unitario</b></TableCell>
                  <TableCell align="center"><b>Cantidad</b></TableCell>
                  <TableCell align="right"><b>Descuento</b></TableCell>
                  <TableCell align="right"><b>Subtotal</b></TableCell>
                  <TableCell align="center"><b>Acciones</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderDetails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center'>
                      No se encontraron productos para esta orden
                    </TableCell>
                  </TableRow>
                ) : (
                  orderDetails.map((item) => (
                    <TableRow key={item.productId} hover>
                      <TableCell>{item.productId}</TableCell>
                      <TableCell align="right">${item.unitPrice?.toFixed(2)}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${(item.discount * 100)?.toFixed(1)}%`} 
                          size="small" 
                          color={item.discount > 0 ? "secondary" : "default"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${calcularSubtotal(item)?.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Eliminar producto de la orden">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteProduct(item.productId)}
                            disabled={deleting === item.productId}
                          >
                            {deleting === item.productId ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button 
            onClick={() => setDeleteOrderDialog(true)}
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Eliminar Orden Completa
          </Button>
          
          <Button onClick={() => setOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar orden completa */}
      <Dialog open={deleteOrderDialog} onClose={() => setDeleteOrderDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de eliminar la orden <strong>#{orderId}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Se eliminarán {orderDetails.length} productos asociados a esta orden.
          </Typography>
          <Alert severity="error">
            ¡Esta acción no se puede deshacer!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteOrderDialog(false)} 
            disabled={deletingOrder}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteOrder} 
            color="error" 
            variant="contained"
            disabled={deletingOrder}
            startIcon={deletingOrder ? <CircularProgress size={16} /> : null}
          >
            {deletingOrder ? 'Eliminando...' : 'Eliminar Orden'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}