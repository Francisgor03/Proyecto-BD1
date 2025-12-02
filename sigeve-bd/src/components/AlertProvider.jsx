import { useState } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import AlertContext from '../utils/alertContext';

// Animación suave
function SlideUp(props) {
  return <Slide {...props} direction='up' />;
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleClose = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}

      <Snackbar
        open={alert.open}
        autoHideDuration={2800}
        onClose={handleClose}
        TransitionComponent={SlideUp}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          variant='filled'
          onClose={handleClose}
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0px 4px 18px rgba(0,0,0,0.20)',
            animation: 'pulse 0.3s ease-out'
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Animación extra para hacerlo más bonito */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </AlertContext.Provider>
  );
}
