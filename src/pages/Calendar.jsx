import { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import {
  Container,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
  Button,
  Drawer,
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  subMonths,
  addMonths,
} from 'date-fns';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const { incidents } = useContext(DataContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // current viewing month state - start with today
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [selectedDate, setSelectedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get days to render for month view - full calendar grid including empty days for alignment
  const getMonthDays = () => {
    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);

    const startDate = startOfWeek(startMonth, { weekStartsOn: 0 }); // Sunday start
    const endDate = addDays(startOfWeek(endMonth, { weekStartsOn: 0 }), 6);

    const days = [];
    let day = startDate;
    while (day <= endMonth || day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  // Get 7 days for current week (starting Sunday)
  const getWeekDays = () => {
    const startWeek = startOfWeek(currentMonth, { weekStartsOn: 0 });
    return [...Array(7)].map((_, i) => addDays(startWeek, i));
  };

  const days = viewMode === 'month' ? getMonthDays() : getWeekDays();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Status color helper
  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Calendar - {format(currentMonth, 'MMMM yyyy')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <ButtonGroup size={isMobile ? 'small' : 'medium'}>
          <Button
            variant={viewMode === 'month' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
        </ButtonGroup>

        {viewMode === 'month' && (
          <Box>
            <Button size={isMobile ? 'small' : 'medium'} onClick={prevMonth} sx={{ mr: 1 }}>
              &lt; Prev
            </Button>
            <Button size={isMobile ? 'small' : 'medium'} onClick={nextMonth}>
              Next &gt;
            </Button>
          </Box>
        )}
      </Box>

      {/* Day names header for month view */}
      {viewMode === 'month' && (
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {DAY_NAMES.map((dayName) => (
            <Grid
              key={dayName}
              item
              xs={12 / 7}
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: theme.palette.text.secondary,
              }}
            >
              {dayName}
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={1}>
        {days.map((day) => {
          const dayIncidents = incidents.filter((i) =>
            isSameDay(parseISO(i.appointmentDate), day)
          );
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <Grid
              key={day.toISOString()}
              item
              xs={viewMode === 'month' ? 12 / 7 : 12}
              onClick={() => handleDateClick(day)}
              sx={{
                cursor: 'pointer',
                opacity: isCurrentMonth ? 1 : 0.3,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 1,
                },
                minHeight: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 1,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 0.5,
                    fontWeight: 'bold',
                    color: isCurrentMonth ? theme.palette.text.primary : theme.palette.text.disabled,
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                  {dayIncidents.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No appointments
                    </Typography>
                  ) : (
                    dayIncidents.map((i) => (
                      <Tooltip
                        key={i.id}
                        title={`${i.title} at ${format(parseISO(i.appointmentDate), 'hh:mm a')}`}
                        arrow
                        placement="top"
                      >
                        <ListItem
                          sx={{
                            py: 0.3,
                            fontSize: '0.85rem',
                            color: getStatusColor(i.status),
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'default',
                          }}
                        >
                          {format(parseISO(i.appointmentDate), 'hh:mm a')} – {i.title}
                        </ListItem>
                      </Tooltip>
                    ))
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Drawer with day details */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box
          sx={{
            width: isMobile ? '90vw' : 360,
            p: 2,
          }}
          role="presentation"
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              {selectedDate ? format(selectedDate, 'dd MMM yyyy (EEEE)') : ''}
            </Typography>
            <IconButton onClick={handleDrawerClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>

          <List dense>
            {incidents.filter((i) =>
              selectedDate ? isSameDay(parseISO(i.appointmentDate), selectedDate) : false
            ).length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No appointments for this day.
              </Typography>
            )}
            {incidents
              .filter((i) => selectedDate && isSameDay(parseISO(i.appointmentDate), selectedDate))
              .map((i) => (
                <ListItem key={i.id} sx={{ alignItems: 'flex-start' }}>
                  <Box
                    component="span"
                    sx={{
                      color: getStatusColor(i.status),
                      mr: 1,
                      fontSize: '1.3rem',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                    aria-label={i.status}
                  >
                    ●
                  </Box>
                  <ListItemText
                    primary={`${format(parseISO(i.appointmentDate), 'hh:mm a')} — ${i.title}`}
                    secondary={`Status: ${i.status || 'Pending'}`}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>
    </Container>
  );
}