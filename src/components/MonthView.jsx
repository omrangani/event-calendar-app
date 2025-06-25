const MonthView = ({ generateMonthGrid, openModal, renderEvents }) => {
  return (
    <div className="grid grid-cols-7 gap-3 text-center">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div key={day} className="font-bold text-gray-600">{day}</div>
      ))}
      {generateMonthGrid().map((date, idx) => (
        <div
          key={idx}
          className="border h-28 rounded-xl p-2 bg-white hover:bg-blue-50 cursor-pointer shadow-sm relative"
          onClick={() => date && openModal(null, date.toISOString().slice(0, 10))}
        >
          <div className="text-sm text-gray-400 absolute top-1 left-1">{date?.getDate()}</div>
          <div className="mt-6 space-y-1">
            {renderEvents(date)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;
