const WeekView = ({ getWeekDates, openModal, renderEvents }) => {
  return (
    <div className="grid grid-cols-7 gap-3 text-center">
      {getWeekDates().map(date => (
        <div
          key={date.toISOString()}
          className="border h-32 rounded-xl p-3 bg-white hover:bg-blue-50 cursor-pointer shadow-sm"
          onClick={() => openModal(null, date.toISOString().slice(0, 10))}
        >
          <div className="text-sm font-semibold text-gray-600">{date.toDateString()}</div>
          <div className="mt-2 space-y-1">
            {renderEvents(date)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekView;