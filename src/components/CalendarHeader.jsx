import React from 'react';

export default function CalendarHeader({
  activeDate,
  setActiveDate,
  viewMode,
  setViewMode,
}) {
  const monthName = activeDate.toLocaleString('default', { month: 'long' });
  const year = activeDate.getFullYear();
  return (
    <div className=" py-2 px-4">
      <div className="flex justify-between items-center">
        {/* Month + Year */}
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{monthName}</div>
          <div className="text-xl text-gray-500">{year}</div>
        </div>

        {/* Nav Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className="text-sm  hover:text-black hover:underline bg-transparent hover:bg-white"
            onClick={() =>
              setActiveDate(
                new Date(activeDate.getFullYear(), activeDate.getMonth() + 1)
              )
            }
          >
            &lt;
          </button>
          <button
            className="text-sm  hover:text-black hover:underline bg-transparent hover:bg-white"
            onClick={() => setActiveDate(new Date())}
          >
            Today
          </button>
          <button
            className="text-sm  hover:text-black hover:underline bg-transparent hover:bg-white"
            onClick={() =>
              setActiveDate(
                new Date(activeDate.getFullYear(), activeDate.getMonth() - 1)
              )
            }
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
