import { useDraggable } from '@dnd-kit/core';

/**
 * Calendar card that can be dragged to another day
 */
export default function DraggableCalendarTask({ task, date, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({
      id: `calendar-task-${task.id}`,
      data: { nodeId: task.id, type: 'task', date }, // date = current day
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={onClick}
      className="bg-white dark:bg-neutral-600 rounded-xs p-1 mb-1 shadow text-xs truncate cursor-move"
    >
      {task.cells?.name || 'Untitled'}
    </div>
  );
}
