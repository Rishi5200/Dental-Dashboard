import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Calendar from './pages/Calendar';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Dental Dashboard
          </Typography>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/">Dashboard</Button>
              {user.role === 'Admin' && (
                <>
                  <Button color="inherit" component={Link} to="/patients">Patients</Button>
                  <Button color="inherit" component={Link} to="/calendar">Calendar</Button>
                </>
              )}
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <PrivateRoute roles={['Admin']}>
                <Patients />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <PrivateRoute>
                <PatientDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute roles={['Admin']}>
                <Calendar />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
      <Container sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="caption">© {new Date().getFullYear()} ENTNT Dental Center</Typography>
      </Container>
    </>
  );
}
