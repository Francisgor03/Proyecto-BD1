import React, { useEffect, useState } from 'react';
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
  Box
} from '@mui/material';

import { procedimientosApi } from '../../services/api';

export default function HistoryOrders({ open, onClose, idCustomer }) {
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (open && idCustomer) cargarHistorial();
  }, [open, idCustomer]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await procedimientosApi.getHistorialCliente(idCustomer);
      setHistorial(response.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  console.log(historial);
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Historial del Cliente: {idCustomer}</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Pedido</b>
                </TableCell>
                <TableCell>
                  <b>Fecha</b>
                </TableCell>
                <TableCell>
                  <b>Total</b>
                </TableCell>
                <TableCell>
                  <b>Estado</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {historial.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    Sin resultados
                  </TableCell>
                </TableRow>
              ) : (
                historial.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.orderID}</TableCell>

                    <TableCell>{new Date(item.orderDate).toLocaleDateString('es-PE')}</TableCell>

                    <TableCell>${item.freight?.toFixed(2)}</TableCell>

                    <TableCell>{item.shippedDate ? 'Enviado' : 'Pendiente'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
