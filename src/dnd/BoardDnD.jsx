import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

import { useStore } from '../state/store';

export default function BoardDnD({ statusOptions, children }) {
  /* a single sensor is enough */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const moveNode = useStore((s) => s.moveNode);
  const updateNode = useStore((s) => s.updateNode);

  /* helper – extract the clean task id from "board-task-<id>" */
  const getTaskId = (dragId) => dragId.replace(/^board-task-/, '');

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const srcTaskId = getTaskId(active.id);
    const srcTask = useStore.getState().nodesById[srcTaskId];

    /* Dropped on column background ------------------------------------ */
    if (over.id.startsWith('board-column-')) {
      const dstColumnId = over.data.current.columnId; // "Not Started" etc.

      /* move to top of that column */
      moveNode(srcTaskId, srcTask.parentId, 0);

      /* patch the status field */
      updateNode(srcTaskId, {
        cells: { ...srcTask.cells, status: dstColumnId },
      });
      return;
    }

    /* Dropped on another card ----------------------------------------- */
    const dstTaskId = getTaskId(over.id);
    const dstTask = useStore.getState().nodesById[dstTaskId];
    if (!dstTask) return; // safety

    /* same-column reorder */
    if (srcTask.cells.status === dstTask.cells.status) {
      /* … existing reorder logic … */
      return;
    }

    /* move into a different column via another card */
    const dstColumnId = over.data.current.columnId;
    moveNode(srcTaskId, srcTask.parentId, 0);
    updateNode(srcTaskId, {
      cells: { ...srcTask.cells, status: dstColumnId },
    });
  };

  /* Wrap the entire set of columns */
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* group all cards in one SortableContext so cross-column moves work */}
      <SortableContext items={statusOptions}>{children}</SortableContext>
    </DndContext>
  );
}
