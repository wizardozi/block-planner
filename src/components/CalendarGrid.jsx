import React from 'react';
import CalendarDayCell from '../components/CalendarDayCell';

export default function CalendarGrid({ dateRange, tasks }) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (targetDate) => {
    return tasks.filter((task) => {
      const dueStart = task.fields?.due?.start;
      if (!dueStart) return false;

      const due = new Date(dueStart);

      return (
        due.getFullYear() === targetDate.getFullYear() &&
        due.getMonth() === targetDate.getMonth() &&
        due.getDate() === targetDate.getDate()
      );
    });
  };

  return (
    <div className="p-4">
      {/* Day labels */}
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 6 rows of 7 days */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-700">
        {dateRange.map((date, i) => (
          <CalendarDayCell key={i} date={date} tasks={getTasksForDate(date)} />
        ))}
      </div>
    </div>
  );
}
