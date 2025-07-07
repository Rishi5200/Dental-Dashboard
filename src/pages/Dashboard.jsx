import { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import {
Typography,
Container,
Paper,
Grid,
List,
ListItem,
ListItemText,
Divider,
Link,
Box,
Chip,
Stack,
Card,
CardContent
} from '@mui/material';
import { format, parseISO, isAfter } from 'date-fns';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

export default function Dashboard() {
const { patients, incidents } = useContext(DataContext);
const { user } = useContext(AuthContext);

const isAdmin = user.role === 'Admin';
const ownIncidents = isAdmin
? incidents
: incidents.filter((i) => i.patientId === user.patientId);

const upcoming = ownIncidents
.filter((i) => isAfter(new Date(i.appointmentDate), new Date()))
.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

const past = ownIncidents
.filter((i) => !isAfter(new Date(i.appointmentDate), new Date()))
.sort((a, b) => new Date(b.appointmentDate) - new Date(b.appointmentDate));

const totalRevenue = incidents.reduce((sum, i) => sum + (i.cost || 0), 0);

const ownPatients = isAdmin
? patients
: patients.filter((p) => p.id === user.patientId);

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
Welcome {isAdmin ? 'Dentist' : ownPatients[0]?.name || 'Patient'}
</Typography>

php-template
Copy
Edit
  {isAdmin ? (
    <>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PeopleIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h6">Patients</Typography>
                  <Typography variant="h4">{patients.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#f1f8e9' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <MonetizationOnIcon fontSize="large" color="success" />
                <Box>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4">${totalRevenue}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <EventAvailableIcon fontSize="large" color="warning" />
                <Box>
                  <Typography variant="h6">Upcoming Appointments</Typography>
                  <Typography variant="h4">{upcoming.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Next 10 Appointments
        </Typography>
        <List>
          {upcoming.slice(0, 10).map((i) => (
            <ListItem key={i.id} disablePadding sx={{ py: 1 }}>
              <ListItemText
                primary={`${format(parseISO(i.appointmentDate), 'dd MMM yyyy HH:mm')} — ${i.title}`}
                secondary={<Chip label={i.status || 'Pending'} size="small" color={getStatusColor(i.status)} />}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  ) : (
    <>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upcoming Appointments
        </Typography>
        <List>
          {upcoming.length === 0 && (
            <ListItem>
              <ListItemText primary="No upcoming appointments." />
            </ListItem>
          )}
          {upcoming.map((i) => (
            <ListItem key={i.id}>
              <ListItemText
                primary={`${i.title} — ${format(parseISO(i.appointmentDate), 'dd MMM yyyy HH:mm')}`}
                secondary={<Chip label={i.status || 'Pending'} color={getStatusColor(i.status)} size="small" />}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Treatment History
        </Typography>
        <List>
          {past.length === 0 && (
            <ListItem>
              <ListItemText primary="No past treatments." />
            </ListItem>
          )}
          {past.map((i) => (
            <div key={i.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${i.title} — ${format(parseISO(i.appointmentDate), 'dd MMM yyyy HH:mm')}`}
                  secondary={
                    <>
                      <Chip label={i.status || 'Pending'} size="small" color={getStatusColor(i.status)} /> <br />
                      Cost: ${i.cost || '-'} <br />
                      {i.files && i.files.length > 0 && (
                        <>
                          Files:{' '}
                          {i.files.map((file, idx) => (
                            <Link
                              key={idx}
                              href={file.url}
                              download={file.name}
                              underline="hover"
                              sx={{ mr: 1 }}
                            >
                              {file.name}
                            </Link>
                          ))}
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </>
  )}
</Container>
);
}