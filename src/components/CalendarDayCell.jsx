// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDroppable } from '@dnd-kit/core';

// import { useStore } from '../state/store';
// import DraggableCalendarTask from './DraggableCalendarTask';
// import TaskView from '../views/TaskView';

// export default function CalendarDayCell({ date, tasks }) {
//   const cellId = `calendar-cell-${date?.toISOString().split('T')[0]}`;
//   const { setNodeRef } = useDroppable({ id: cellId, data: { date } });

//   const { projectId } = useParams();

//   const addTask = useStore((s) => s.addTask);
//   const updateNode = useStore((s) => s.updateNode);

//   const [selectedTaskId, setSelectedTaskId] = useState(null);

//   /* weekend / today styling */
//   const isWeekend = date && (date.getDay() === 0 || date.getDay() === 6);

//   const todayFlag = (() => {
//     if (!date) return false;
//     const now = new Date();
//     return (
//       date.getDate() === now.getDate() &&
//       date.getMonth() === now.getMonth() &&
//       date.getFullYear() === now.getFullYear()
//     );
//   })();

//   /* helper to yyyy-mm-ddT00:00 */
//   const midnightISO = (d) =>
//     `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
//       d.getDate()
//     ).padStart(2, '0')}T00:00`;

//   /* double-click → quick task */
//   const handleDouble = () => {
//     if (!date) return;

//     const id = addTask(projectId); // create child of this project

//     // patch due date + default status
//     updateNode(id, {
//       cells: {
//         ...useStore.getState().nodesById[id].cells,
//         status: 'Not Started',
//         due: { start: midnightISO(date), end: null },
//       },
//     });

//     setSelectedTaskId(id); // open modal
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       className={`h-30 p-1 text-right text-xs
//         ${
//           isWeekend
//             ? 'bg-gray-100 dark:bg-neutral-900'
//             : 'bg-white dark:bg-neutral-800'
//         }`}
//       onDoubleClick={handleDouble}
//     >
//       {/* day number */}
//       {date && (
//         <span
//           className={`inline-block w-6 h-6 leading-6 text-center rounded-full
//             ${todayFlag ? 'bg-red-400 text-white font-semibold' : ''}`}
//         >
//           {date.getDate()}
//         </span>
//       )}

//       {/* tasks inside this cell */}
//       {/* tasks inside this cell */}
//       {tasks?.map((task) => (
//         <DraggableCalendarTask
//           key={task.id}
//           task={task}
//           date={date.toISOString().split('T')[0]} // ← pass day string
//           onClick={() => setSelectedTaskId(task.id)}
//         />
//       ))}

//       {selectedTaskId && (
//         <TaskView
//           taskId={selectedTaskId}
//           mode="modal"
//           onClose={() => setSelectedTaskId(null)}
//         />
//       )}
//     </div>
//   );
// }
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDroppable } from '@dnd-kit/core';

import { useStore } from '../state/store';
import DraggableCalendarTask from './DraggableCalendarTask';
import TaskView from '../views/TaskView';

export default function CalendarDayCell({ date, tasks }) {
  const yyyyMmDd = date?.toISOString().split('T')[0];
  const cellId = `calendar-cell-${yyyyMmDd}`;

  /* advertise kind + date to global drop handler */
  const { setNodeRef } = useDroppable({
    id: cellId,
    data: { kind: 'calendar-day', date: yyyyMmDd },
  });

  const { projectId } = useParams();
  const addTask = useStore((s) => s.addTask);
  const updateNode = useStore((s) => s.updateNode);

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  /* quick-add on double-click */
  const handleDouble = () => {
    const id = addTask(projectId);
    updateNode(id, {
      cells: {
        ...useStore.getState().nodesById[id].cells,
        status: 'Not Started',
        due: { start: `${yyyyMmDd}T00:00`, end: null },
      },
    });
    setSelectedTaskId(id);
  };

  const isWeekend = date && (date.getDay() === 0 || date.getDay() === 6);

  const isToday = (() => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  })();

  return (
    <div
      ref={setNodeRef}
      onDoubleClick={handleDouble}
      className={`h-30 p-1 text-right text-xs ${
        isWeekend
          ? 'bg-gray-100 dark:bg-neutral-900'
          : 'bg-white dark:bg-neutral-800'
      }`}
    >
      {/* day number */}
      {date && (
        <span
          className={`inline-block w-6 h-6 leading-6 text-center rounded-full ${
            isToday ? 'bg-red-400 text-white font-semibold' : ''
          }`}
        >
          {date.getDate()}
        </span>
      )}

      {/* tasks in this cell */}
      {tasks.map((task) => (
        <DraggableCalendarTask
          key={task.id}
          task={task}
          date={yyyyMmDd}
          onClick={() => setSelectedTaskId(task.id)}
        />
      ))}

      {selectedTaskId && (
        <TaskView
          taskId={selectedTaskId}
          mode="modal"
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
