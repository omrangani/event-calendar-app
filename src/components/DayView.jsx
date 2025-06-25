const DayView = ({ selectedDate, renderEvents }) => {
  const today = new Date();

  const getHeadingLabel = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const getMessageLabel = () => {
    const sel = new Date(selectedDate.toDateString());
    const now = new Date(today.toDateString());

    const diffTime = sel - now;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === -1) return 'yesterday';

    return 'this day';
  };

  const events = renderEvents(selectedDate);

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm`}>
      <div className="text-lg font-bold text-blue-700 mb-3">
        {getHeadingLabel()}
      </div>
      <div className="space-y-2">
        {events.length ? (
          events
        ) : (
          <p className="text-gray-400 italic">No events on {getMessageLabel()}.</p>
        )}
      </div>
    </div>
  );
};

export default DayView;
