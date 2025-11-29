import AppRoutes from './routes/AppRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

function App() {
 return (
   <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
     <AppRoutes />;
   </LocalizationProvider>
 );
}

export default App;
