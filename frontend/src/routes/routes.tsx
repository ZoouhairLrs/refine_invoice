import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Produits from '../pages/Produits';
import Clients from '../pages/Clients';
import Factures from '../pages/Factures';
import BondDeCommands from '../pages/BondDeCommand';
import Devis from '../pages/Devis';
import CreateFacture from '../components/CreateFacture';
import { RootState } from '../redux/store'; // Adjust according to your file structure
import AppLayout from '../Layouts';
import { ToastAction } from '@radix-ui/react-toast';

const AppRoutes = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Routes>
      {/* Default route: if the user is authenticated, redirect to dashboard, otherwise to login */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      {/* Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Route for Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/produits"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Produits />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Clients />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/factures"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Factures />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ajouter-facture"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateFacture />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bonddecommand"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BondDeCommands />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/devis"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Devis />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;
