import { useDraggable } from '@dnd-kit/core';

export default function DraggableCalendarTask({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `calendar-task-${task.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xs text-left truncate cursor-move"
    >
      {task.fields?.name || 'Task'}
    </div>
  );
}
