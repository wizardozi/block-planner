import { useParams } from 'react-router-dom';
import { useTaskManager } from '../context/TaskContext';
import TaskView from '../views/TaskView';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import DraggableCalendarTask from './DraggableCalendarTask';

export default function CalendarDayCell({ date, tasks }) {
  const cellId = `calendar-cell-${date.toISOString().split('T')[0]}`;

  const { setNodeRef } = useDroppable({ id: cellId });

  const { projectId } = useParams();

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const isWeekend = date && (date.getDay() === 0 || date.getDay() === 6);

  const currentDate = new Date();

  const today =
    date &&
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear();

  const { setTasks, updateTask, addTask, deleteTask, getTaskById } =
    useTaskManager();

  return (
    <div
      ref={setNodeRef}
      className={`h-30 p-1 text-right text-xs
    ${
      isWeekend
        ? 'bg-gray-100 dark:bg-neutral-900'
        : 'bg-white dark:bg-neutral-800'
    }
  `}
      onDoubleClick={() => {
        const toLocalDateTimeString = (d) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}T00:00`;
        };

        const newTask = {
          id: crypto.randomUUID(),
          type: 'task',
          fields: {
            name: '',
            status: 'Not Started',
            priority: 'Medium',
            due: {
              start: toLocalDateTimeString(date),
              end: null,
            },
          },
          parentId: projectId,
          blocks: [],
        };
        addTask(newTask);
        setSelectedTaskId(newTask.id); // 👈 open TaskView with this task
      }}
    >
      {date ? (
        <span
          className={`inline-block w-6 h-6 leading-6 text-center rounded-full
      ${today ? 'bg-red-400 text-white font-semibold' : ''}`}
        >
          {date.getDate()}
        </span>
      ) : (
        ''
      )}
      {tasks?.map((task) => (
        <DraggableCalendarTask
          key={task.id}
          task={task}
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
