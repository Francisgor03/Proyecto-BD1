import { useState, useEffect } from 'react';
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
import { Trash, Eye, Plus } from 'lucide-react';

import { orderDetailsApi } from '/src/services/api';
import FormOrderDetail from './FormOrderDetail';
import { useAlert } from '../../utils/useAlert'; 

export default function OrderDetails({ orderId }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingDetailId, setDeletingDetailId] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  const showAlert = useAlert(); // ALERTA GLOBAL 😎

  const loadDetails = async () => {
    try {
      setLoading(true);
      const { data } = await orderDetailsApi.getByOrderId(orderId);
      setDetails(data || []);
    } catch {
      setDetails([]);
      showAlert('Error cargando detalles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadDetails();
  }, [open]);

  const subtotal = item => item.unitPrice * (1 - item.discount) * item.quantity;
  const total = details.reduce((acc, item) => acc + subtotal(item), 0);

  const handleDeleteDetail = async productId => {
    setDeletingDetailId(productId);
    try {
      await orderDetailsApi.deleteOrderDetail(orderId, productId);

      setDetails(prev => prev.filter(d => d.productId !== productId));

      showAlert('Producto eliminado correctamente', 'success');
    } catch {
      showAlert('Error eliminando detalle', 'error');
    } finally {
      setDeletingDetailId(null);
    }
  };

  const handleSaveDetail = () => {
    loadDetails();
    showAlert('Producto agregado correctamente', 'success');
  };

  return (
    <>
      <Tooltip title='Ver detalles'>
        <IconButton size='small' color='primary' onClick={() => setOpen(true)}>
          <Eye size={18} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='lg'>
        <DialogTitle>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>Orden {orderId}</Typography>

            {details.length > 0 && (
              <Box display='flex' gap={2}>
                <Chip label={`${details.length} productos`} variant='outlined' />
                <Chip label={`Total: $${total.toFixed(2)}`} color='primary' />
              </Box>
            )}
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
            <Alert severity='info' sx={{ flex: 1, mr: 2 }}>
              Gestión de detalles de la orden.
            </Alert>

            <Button
              variant='contained'
              color='success'
              startIcon={<Plus size={18} />}
              onClick={() => setOpenForm(true)}
            >
              Agregar Detalle
            </Button>
          </Box>

          {loading ? (
            <Box display='flex' justifyContent='center' height={200}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Producto ID</TableCell>
                  <TableCell align='right'>Precio Unit.</TableCell>
                  <TableCell align='center'>Cantidad</TableCell>
                  <TableCell align='right'>Desc.</TableCell>
                  <TableCell align='right'>Subtotal</TableCell>
                  <TableCell align='center'>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {details.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center'>
                      Sin productos
                    </TableCell>
                  </TableRow>
                ) : (
                  details.map(item => (
                    <TableRow key={item.productId} hover>
                      <TableCell>{item.productId}</TableCell>
                      <TableCell align='right'>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell align='center'>{item.quantity}</TableCell>
                      <TableCell align='right'>
                        <Chip
                          label={`${(item.discount * 100).toFixed(1)}%`}
                          size='small'
                          color={item.discount > 0 ? 'secondary' : 'default'}
                        />
                      </TableCell>
                      <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                        ${subtotal(item).toFixed(2)}
                      </TableCell>

                      <TableCell align='center'>
                        <IconButton
                          size='small'
                          color='error'
                          disabled={deletingDetailId === item.productId}
                          onClick={() => handleDeleteDetail(item.productId)}
                        >
                          {deletingDetailId === item.productId ? <CircularProgress size={20} /> : <Trash size={18} />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant='contained' onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <FormOrderDetail open={openForm} onClose={() => setOpenForm(false)} orderId={orderId} onSave={handleSaveDetail} />
    </>
  );
}
