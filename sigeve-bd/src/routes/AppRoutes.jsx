import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import Customers from '../pages/Customers';
import Orders from '../pages/Orders';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<DashboardLayout />}>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/orders' element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
