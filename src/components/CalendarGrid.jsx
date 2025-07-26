import CalendarDayCell from './CalendarDayCell';

export default function CalendarGrid({ dateRange, tasks }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /* helper: group tasks by day */
  const forDate = (target) =>
    tasks.filter((t) => {
      const iso = t.cells?.due?.start;
      if (!iso) return false;
      const d = new Date(iso);
      return (
        d.getFullYear() === target.getFullYear() &&
        d.getMonth() === target.getMonth() &&
        d.getDate() === target.getDate()
      );
    });

  return (
    <div className="p-4">
      {/* weekday header */}
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 6 × 7 grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-700">
        {dateRange.map((d, i) => (
          <CalendarDayCell key={i} date={d} tasks={forDate(d)} />
        ))}
      </div>
    </div>
  );
}
