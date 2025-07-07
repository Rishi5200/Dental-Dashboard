import { useContext, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Patients() {
  const { patients, addPatient, deletePatient, updatePatient } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dob: '',
    contact: '',
    healthInfo: ''
  });
  const [editPatient, setEditPatient] = useState(null);

  const isAdmin = user.role === 'Admin';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editPatient) {
      updatePatient({ ...editPatient, ...form });
    } else {
      addPatient(form);
    }
    setOpen(false);
    setForm({ name: '', dob: '', contact: '', healthInfo: '' });
    setEditPatient(null);
  };

  const handleDelete = (id) => {
    if (confirm('Delete patient?')) deletePatient(id);
  };

  const handleOpenEdit = (patient) => {
    setEditPatient(patient);
    setForm({
      name: patient.name,
      dob: patient.dob,
      contact: patient.contact,
      healthInfo: patient.healthInfo
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditPatient(null);
    setForm({ name: '', dob: '', contact: '', healthInfo: '' });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>

      {isAdmin && (
        <Button variant="contained" sx={{ mb: 3 }} onClick={() => setOpen(true)}>
          Add Patient
        </Button>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>DOB</strong></TableCell>
                <TableCell><strong>Contact</strong></TableCell>
                <TableCell><strong>Health Info</strong></TableCell>
                {isAdmin && <TableCell align="center"><strong>Actions</strong></TableCell>}
              </TableRow>
            </TableHead>

            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Link to={`/patients/${p.id}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: '500' }}>
                      {p.name}
                    </Link>
                  </TableCell>
                  <TableCell>{p.dob}</TableCell>
                  <TableCell>{p.contact}</TableCell>
                  <TableCell>{p.healthInfo}</TableCell>
                  {isAdmin && (
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit Patient">
                          <IconButton size="small" onClick={() => handleOpenEdit(p)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Patient">
                          <IconButton size="small" onClick={() => handleDelete(p.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {patients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No patients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editPatient ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="DOB"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            label="Contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Health Info"
            name="healthInfo"
            value={form.healthInfo}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editPatient ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
