import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

const EventModal = ({ event, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const pad = (n) => (n < 10 ? '0' + n : n);
  const firstDayOfMonth = `${year}-${pad(month + 1)}-01`;
  const lastDayOfMonth = `${year}-${pad(month + 1)}-${pad(new Date(year, month + 1, 0).getDate())}`;

  useEffect(() => {
    setTitle(event?.title || '');
    setDate(event?.date || new Date().toISOString().slice(0, 10));
    setStart(event?.start || '09:00');
    setEnd(event?.end || '10:00');
  }, [event]);

  const validateEvent = (event, allEvents) => {
    const { title, date, start, end, id } = event;
    if (!title || !title.trim()) {
      return { valid: false, message: 'Title is required.' };
    }
    if (!date || !start || !end) {
      return { valid: false, message: 'Date and time fields are required.' };
    }
    if (start >= end) {
      return { valid: false, message: 'Start time must be before end time.' };
    }

    const newStart = `${date}T${start}`;
    const newEnd = `${date}T${end}`;

    const isOverlap = allEvents.some(ev => {
      if (ev.id === id) return false;
      if (ev.date !== date) return false;

      const evStart = `${ev.date}T${ev.start}`;
      const evEnd = `${ev.date}T${ev.end}`;

      return (
        (newStart >= evStart && newStart < evEnd) ||
        (newEnd > evStart && newEnd <= evEnd) ||
        (newStart <= evStart && newEnd >= evEnd)
      );
    });
    if (isOverlap) {
      return { valid: false, message: 'An event already exists in this time slot.' };
    }

    const isDuplicate = allEvents.find(e =>
      e.title.trim().toLowerCase() === event.title.trim().toLowerCase() &&
      e.date === event.date &&
      e.id !== event.id
    );

    if (isDuplicate) {
      const [year, month, day] = isDuplicate.date.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      return { valid: false, message: `An event with the same title already exists on ${formattedDate}` };
    }

    return { valid: true };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const currentEvent = { ...event, title, date, start, end };
    const { valid, message } = validateEvent(currentEvent, storedEvents);

    if (!valid) {
      toast.error(message);
      return;
    }

    onSave(currentEvent);
    toast.success('Event saved successfully!');
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.25rem',
          fontWeight: 600,
          padding: '16px 24px'
        }}
      >
        {event?.id ? 'Edit Event' : 'Create Event'}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ padding: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                size="small"
                inputProps={{
                  min: firstDayOfMonth,
                  max: lastDayOfMonth,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Time"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="End Time"
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: { xs: 2, sm: 3 }, gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            {event?.id && (
              <Button onClick={() => onDelete(event.id)} color="error" variant="outlined">
                Delete
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={onClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventModal;