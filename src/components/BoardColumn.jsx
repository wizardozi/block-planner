import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDroppable } from '@dnd-kit/core';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableContext } from '@dnd-kit/sortable';
import { useStore } from '../state/store';

import { SortableBoardCard } from './SortableBoardCard';
import TaskView from '../views/TaskView';

export default function BoardColumn({ status }) {
  const { projectId } = useParams();
  const addTask = useStore((s) => s.addTask);
  const nodesById = useStore((s) => s.nodesById); // stable ref

  /* tasks in this column */
  const tasks = useMemo(
    () =>
      Object.values(nodesById).filter(
        (n) =>
          n.type === 'task' &&
          n.parentId === projectId &&
          n.cells?.status === status
      ),
    [nodesById, projectId, status]
  );

  /* droppable — advertise column info to global handler */
  const { setNodeRef } = useDroppable({
    id: `board-column-${status}`,
    data: { kind: 'board-column', status },
  });

  const [selected, setSelected] = useState(null);

  return (
    <div
      ref={setNodeRef}
      className="min-w-70 bg-gray-50 dark:bg-neutral-700 rounded-xs relative"
    >
      <div className="ml-3 font-bold">{status}</div>

      {/* quick-add button */}
      <button
        className="absolute right-3 top-1"
        onClick={() => {
          const id = addTask(projectId);
          useStore.getState().updateNode(id, (d) => (d.cells.status = status));
          setSelected(id);
        }}
      >
        +
      </button>

      <SortableContext
        id={`board-column-${status}`}
        items={tasks.map((t) => `board-task-${t.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="pt-2">
          {tasks.map((task) => (
            <SortableBoardCard
              key={task.id}
              id={`board-task-${task.id}`}
              task={task}
              columnId={status}
              onClick={() => setSelected(task.id)}
            />
          ))}
        </div>
      </SortableContext>

      {selected && (
        <TaskView
          taskId={selected}
          mode="drawer"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
