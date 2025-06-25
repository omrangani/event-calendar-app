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
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EventModal = ({ event, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setTitle(event?.title || '');
    setDate(event?.date || new Date().toISOString().slice(0, 10));
    setStart(event?.start || '09:00');
    setEnd(event?.end || '10:00');
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required.');
    if (start >= end) return alert('Start time must be before End time.');
    onSave({ ...event, title, date, start, end });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
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

        <DialogActions sx={{ padding: { xs: 2, sm: 3 }, gap: 1 }}>
          {event?.id && (
            <Button onClick={() => onDelete(event.id)} color="error" variant="outlined">
              Delete
            </Button>
          )}
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventModal;