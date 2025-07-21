import { useState } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import CalendarHeader from '../components/CalendarHeader';
import { getDateRange } from '../utils/dateUtils';

// CalendarView.jsx
export default function CalendarView({ projectTasks, allTasks }) {
  const [activeDate, setActiveDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  const dateRange = getDateRange(viewMode, activeDate); // returns list of Dates

  return (
    <div>
      <CalendarHeader
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <CalendarGrid dateRange={dateRange} tasks={projectTasks} />
    </div>
  );
}
