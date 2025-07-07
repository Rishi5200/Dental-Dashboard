import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
Container,
Typography,
Paper,
Grid,
Button,
Dialog,
DialogTitle,
DialogContent,
DialogActions,
TextField,
MenuItem,
Select,
InputLabel,
FormControl,
Chip,
Box,
Stack,
Divider,
Card,
CardContent
} from '@mui/material';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

export default function PatientDetail() {
const { id } = useParams();
const { patients, incidents, addIncident, deleteIncident } = useContext(DataContext);
const { user } = useContext(AuthContext);

const patient = patients.find((p) => p.id === id);
const patientIncidents = useMemo(
() => incidents.filter((i) => i.patientId === id),
[incidents, id]
);

const isAdmin = user.role === 'Admin';

const [open, setOpen] = useState(false);
const [form, setForm] = useState({
title: '',
description: '',
comments: '',
appointmentDate: '',
cost: '',
status: 'Pending',
files: []
});

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleFileUpload = (e) => {
const files = Array.from(e.target.files);
const readers = files.map((file) => {
return new Promise((resolve) => {
const reader = new FileReader();
reader.onload = () => {
resolve({ name: file.name, url: reader.result });
};
reader.readAsDataURL(file);
});
});

javascript
Copy
Edit
Promise.all(readers).then((filesWithData) => {
  setForm((prev) => ({ ...prev, files: filesWithData }));
});
};

const handleSubmit = () => {
const finalIncident = {
...form,
cost: form.cost ? parseFloat(form.cost) : undefined,
patientId: id
};
addIncident(finalIncident);
setOpen(false);
setForm({
title: '',
description: '',
comments: '',
appointmentDate: '',
cost: '',
status: 'Pending',
files: []
});
};

const handleDelete = (incidentId) => {
if (confirm('Delete incident?')) {
deleteIncident(incidentId);
}
};

if (!patient) {
return <Typography sx={{ mt: 4, ml: 4 }}>Patient not found</Typography>;
}

const getStatusColor = (status) => {
switch (status) {
case 'Completed': return 'success';
case 'Cancelled': return 'error';
default: return 'warning';
}
};

return (
<Container sx={{ mt: 4 }}>
<Typography variant="h4" gutterBottom>
{patient.name}
</Typography>

php-template
Copy
Edit
  <Paper sx={{ p: 2, mb: 3 }}>
    <Typography>DOB: {patient.dob}</Typography>
    <Typography>Contact: {patient.contact}</Typography>
    <Typography>Health Info: {patient.healthInfo}</Typography>
  </Paper>

  <Typography variant="h5" gutterBottom>
    Incidents
  </Typography>
  {isAdmin && (
    <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
      Add Incident
    </Button>
  )}

  {patientIncidents.length === 0 && (
    <Typography>No incidents found for this patient.</Typography>
  )}

  <Grid container spacing={2}>
    {patientIncidents.map((inc) => (
      <Grid item xs={12} md={6} key={inc.id}>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{inc.title}</Typography>
              <Chip label={inc.status || 'Pending'} color={getStatusColor(inc.status)} />
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Date:</strong> {new Date(inc.appointmentDate).toLocaleString()}
            </Typography>
            {inc.cost && (
              <Typography variant="body2">
                <strong>Cost:</strong> ${inc.cost}
              </Typography>
            )}
            {inc.comments && (
              <Typography variant="body2">
                <strong>Comments:</strong> {inc.comments}
              </Typography>
            )}

            {inc.files && inc.files.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Files:</strong>
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {inc.files.map((f) =>
                    f.url.startsWith('data:image') ? (
                      <img
                        key={f.name}
                        src={f.url}
                        alt={f.name}
                        width={64}
                        style={{ borderRadius: 4 }}
                      />
                    ) : (
                      <a key={f.name} href={f.url} download={f.name}>
                        <Chip label={f.name} variant="outlined" />
                      </a>
                    )
                  )}
                </Stack>
              </Box>
            )}
            {isAdmin && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => handleDelete(inc.id)}
              >
                Delete
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>

  {/* Dialog */}
  <Dialog open={open} onClose={() => setOpen(false)}>
    <DialogTitle>Add Incident</DialogTitle>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <TextField label="Title" name="title" value={form.title} onChange={handleChange} />
      <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
      <TextField label="Comments" name="comments" value={form.comments} onChange={handleChange} />
      <TextField
        label="Appointment Date & Time"
        name="appointmentDate"
        type="datetime-local"
        value={form.appointmentDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Cost (optional)"
        name="cost"
        type="number"
        value={form.cost}
        onChange={handleChange}
      />
      <FormControl>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={form.status} onChange={handleChange} label="Status">
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" component="label">
        Upload Files
        <input type="file" multiple hidden onChange={handleFileUpload} />
      </Button>
      {form.files.length > 0 && (
        <Typography variant="body2" color="textSecondary">
          {form.files.map((f) => f.name).join(', ')}
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="contained" onClick={handleSubmit}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
</Container>
);
}