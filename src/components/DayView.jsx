const DayView = ({ selectedDate, renderEvents }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="text-lg font-bold text-blue-700 mb-3">{selectedDate.toDateString()}</div>
      <div className="space-y-2">
        {renderEvents(selectedDate).length ? renderEvents(selectedDate) : <p className="text-gray-400 italic">No events today.</p>}
      </div>
    </div>
  );
};

export default DayView;
