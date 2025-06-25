import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EventModal from './EventModal';
import { addEvent, updateEvent, deleteEvent as removeEvent } from './store';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';

const Calendar = () => {
  const events = useSelector(state => state.events);
  const dispatch = useDispatch();

  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [search, setSearch] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredEvents = events
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(`${a.date}T${a.start}`) - new Date(`${b.date}T${b.start}`));

  const openModal = (event = null, date = null) => {
    setActiveEvent(event ? { ...event } : { date });
    setModalOpen(true);
  };

  const closeModal = () => {
    setActiveEvent(null);
    setModalOpen(false);
  };

  const saveEvent = (event) => {
    if (event.id) {
      dispatch(updateEvent(event));
    } else {
      dispatch(addEvent({ ...event, id: Date.now() }));
    }
    closeModal();
  };

  const deleteEvent = (id) => {
    dispatch(removeEvent(id));
    closeModal();
  };

  const getWeekDates = () => {
    const base = new Date(selectedDate);
    base.setDate(base.getDate() - base.getDay() + weekOffset * 7);
    return [...Array(7)].map((_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const isAnyDayInCurrentMonth = (weekDates) => {
    return weekDates.some(date =>
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  };

  const canGoPrev = () => {
    const base = new Date(selectedDate);
    base.setDate(base.getDate() - base.getDay() + (weekOffset - 1) * 7);
    const weekDates = [...Array(7)].map((_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
    return isAnyDayInCurrentMonth(weekDates);
  };

  const canGoNext = () => {
    const base = new Date(selectedDate);
    base.setDate(base.getDate() - base.getDay() + (weekOffset + 1) * 7);
    const weekDates = [...Array(7)].map((_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
    return isAnyDayInCurrentMonth(weekDates);
  };

  const isDayAtStart = () => (
    view === 'day' && selectedDate.getDate() === 1 && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear
  );

  const isDayAtEnd = () => (
    view === 'day' && selectedDate.toDateString() === new Date(currentYear, currentMonth + 1, 0).toDateString()
  );

  const goToPrevious = () => {
    if (view === 'month') return;
    const prev = new Date(selectedDate);
    if (view === 'day') {
      if (isDayAtStart()) return;
      prev.setDate(prev.getDate() - 1);
    }
    if (view === 'week' && canGoPrev()) setWeekOffset(prev => prev - 1);
    if (view !== 'week') setSelectedDate(prev);
  };

  const goToNext = () => {
    if (view === 'month') return;
    const next = new Date(selectedDate);
    if (view === 'day') {
      if (isDayAtEnd()) return;
      next.setDate(next.getDate() + 1);
    }
    if (view === 'week' && canGoNext()) setWeekOffset(prev => prev + 1);
    if (view !== 'week') setSelectedDate(next);
  };

  const generateMonthGrid = () => {
    const current = new Date(selectedDate);
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const daysArray = [];
    for (let i = 0; i < startDay; i++) daysArray.push(null);
    for (let d = 1; d <= totalDays; d++) {
      daysArray.push(new Date(year, month, d, 12));
    }
    return daysArray;
  };

  const renderEvents = (date) => (
    filteredEvents
      .filter(e => e.date === date?.toISOString().slice(0, 10))
      .map(e => (
        <div
          key={e.id}
          className="truncate text-xs font-medium text-blue-600 hover:underline cursor-pointer text-left"
          onClick={(ev) => { ev.stopPropagation(); openModal(e); }}
        >
          • {e.title}
        </div>
      ))
  );

  const isPrevDisabled = view === 'day' ? isDayAtStart() : view === 'week' ? !canGoPrev() : true;
  const isNextDisabled = view === 'day' ? isDayAtEnd() : view === 'week' ? !canGoNext() : true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700">Event Calendar</h1>

          <input
            type="text"
            placeholder="Search events..."
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2 w-full max-w-sm transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="flex gap-2">
            {['day', 'week', 'month'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-5 py-2 rounded-xl font-semibold transition duration-200 ${view === v ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => openModal(null, selectedDate)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold shadow-md transition"
          >
            + Add Event
          </button>
        </header>

        <main className="bg-white rounded-2xl p-6 shadow-inner min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPrevious}
              disabled={isPrevDisabled}
              className={`text-blue-600 font-bold px-3 py-1 rounded transition ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
            >
              ← Previous
            </button>
            <h2 className="text-xl font-semibold text-gray-700">
              {view === 'month'
                ? `${selectedDate.toLocaleString('default', { month: 'long' })} ${selectedDate.getFullYear()}`
                : `${view.charAt(0).toUpperCase() + view.slice(1)} View`}
            </h2>
            <button
              onClick={goToNext}
              disabled={isNextDisabled}
              className={`text-blue-600 font-bold px-3 py-1 rounded transition ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
            >
              Next →
            </button>
          </div>

          {view === 'month' && (
            <MonthView
              generateMonthGrid={generateMonthGrid}
              openModal={openModal}
              renderEvents={renderEvents}
            />
          )}

          {view === 'week' && (
            <WeekView
              getWeekDates={getWeekDates}
              openModal={openModal}
              renderEvents={renderEvents}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          )}
          {view === 'day' && (
            <DayView
              selectedDate={selectedDate}
              renderEvents={renderEvents}
            />
          )}
        </main>

        {modalOpen && (
          <EventModal
            event={activeEvent}
            onSave={saveEvent}
            onDelete={deleteEvent}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;