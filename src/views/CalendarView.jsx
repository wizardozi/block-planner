// import { useState, useMemo } from 'react';
// import { useParams } from 'react-router-dom';

// import CalendarGrid from '../components/CalendarGrid';
// import CalendarHeader from '../components/CalendarHeader';
// import { getDateRange } from '../utils/dateUtils';

// import { useStore } from '../state/store';
// import { shallow } from 'zustand/shallow';
// import CalendarDnD from '../dnd/CalendarDnD';

// export default function CalendarView() {
//   const { projectId } = useParams();

//   /* subscribe only to the stable map, not a derived array */
//   const nodesById = useStore((s) => s.nodesById, shallow);

//   /* derive the project’s tasks once per React render */
//   const projectTasks = useMemo(
//     () =>
//       Object.values(nodesById).filter(
//         (n) => n.type === 'task' && n.parentId === projectId
//       ),
//     [nodesById, projectId]
//   );

//   /* local calendar state */
//   const [activeDate, setActiveDate] = useState(new Date()); // today
//   const [viewMode, setViewMode] = useState('month'); // month / week

//   /* 42-day grid for month view (or 7 for week) */
//   const dateRange = useMemo(
//     () => getDateRange(viewMode, activeDate),
//     [viewMode, activeDate]
//   );

//   return (
//     <div>
//       <CalendarHeader
//         activeDate={activeDate}
//         setActiveDate={setActiveDate}
//         viewMode={viewMode}
//         setViewMode={setViewMode}
//       />
//       <CalendarDnD>
//         <CalendarGrid dateRange={dateRange} tasks={projectTasks} />
//       </CalendarDnD>
//     </div>
//   );
// }
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import CalendarGrid from '../components/CalendarGrid';
import CalendarHeader from '../components/CalendarHeader';
import { getDateRange } from '../utils/dateUtils';

import { useStore } from '../state/store';
import { shallow } from 'zustand/shallow';

export default function CalendarView() {
  const { projectId } = useParams();

  /* stable slice */
  const nodesById = useStore((s) => s.nodesById, shallow);

  /* tasks that belong to this project */
  const projectTasks = useMemo(
    () =>
      Object.values(nodesById).filter(
        (n) => n.type === 'task' && n.parentId === projectId
      ),
    [nodesById, projectId]
  );

  /* local calendar state */
  const [activeDate, setActiveDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month / week

  /* date grid for month (42 days) or week (7 days) */
  const dateRange = useMemo(
    () => getDateRange(viewMode, activeDate),
    [viewMode, activeDate]
  );

  return (
    <div>
      <CalendarHeader
        activeDate={activeDate}
        setActiveDate={setActiveDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* no local DnD wrapper – inherits global context */}
      <CalendarGrid dateRange={dateRange} tasks={projectTasks} />
    </div>
  );
}
