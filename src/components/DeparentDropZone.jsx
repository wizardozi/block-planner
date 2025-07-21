import { useDroppable } from '@dnd-kit/core';

export function DeparentDropZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'dropzone-none',
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-7 flex  text-sm transition-all ${
        isOver ? 'border rounded-md' : ''
      }`}
    >
      {/* Drop here to deparent */}
    </div>
  );
}
