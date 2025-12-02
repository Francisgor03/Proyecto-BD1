import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth='xs' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
        <AlertTriangle color='#f44336' size={22} />
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ opacity: 0.8 }}>{message}</Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant='outlined' onClick={onCancel} sx={{ borderRadius: 2 }}>
          Cancelar
        </Button>

        <Button variant='contained' color='error' onClick={onConfirm} sx={{ borderRadius: 2 }}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
