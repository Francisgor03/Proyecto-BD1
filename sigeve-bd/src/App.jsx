import AppRoutes from './routes/AppRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { AlertProvider } from './components/AlertProvider'; 

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <AlertProvider>
        <AppRoutes />
      </AlertProvider>
    </LocalizationProvider>
  );
}

export default App;
