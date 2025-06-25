import { configureStore, createSlice } from '@reduxjs/toolkit';

const getInitialEvents = () => {
  const stored = localStorage.getItem('events');
  return stored ? JSON.parse(stored) : [];
};

const eventsSlice = createSlice({
  name: 'events',
  initialState: getInitialEvents(),
  reducers: {
    addEvent: (state, action) => {
      state.push(action.payload);
    },
    updateEvent: (state, action) => {
      const idx = state.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteEvent: (state, action) => {
      return state.filter(e => e.id !== action.payload);
    },
    setEvents: (state, action) => action.payload,
  },
});

export const { addEvent, updateEvent, deleteEvent, setEvents } = eventsSlice.actions;

const store = configureStore({
  reducer: {
    events: eventsSlice.reducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('events', JSON.stringify(store.getState().events));
});

export default store;
