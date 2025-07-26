import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { useStore } from '../state/store';

/* ---------- GLOBAL DROP HANDLER ---------- */
function handleGlobalDrop({ active, over }) {
  if (!over || !active.data.current || !over.data.current) return;

  const { updateNode, moveNode, nodesById } = useStore.getState();
  const src = active.data.current; // { nodeId, type, … }
  const dest = over.data.current; // { kind: 'calendar-day', date } | …

  /* ➊ Sidebar nesting handled in Sidebar.jsx */

  /* ➋ Board column --------------------------------------------------- */
  if (src.type === 'task') {
    /* a) dropped on column background ------------------------------- */
    if (dest.kind === 'board-column') {
      const old = nodesById[src.nodeId].cells || {};
      updateNode(src.nodeId, { cells: { ...old, status: dest.status } });
      return;
    }

    /* b) dropped on another card ------------------------------------ */
    if (dest.type === 'task') {
      /* prefer columnId from data; fall back to parsing over.id */
      const status =
        dest.columnId ??
        (over.id.startsWith('board-task-')
          ? over.id.split('-')[2] /* board-task-<id> */ &&
            nodesById[dest.nodeId].cells.status
          : null);

      if (status) {
        const old = nodesById[src.nodeId].cells || {};
        updateNode(src.nodeId, { cells: { ...old, status } });
      }
      return;
    }
  }
  /* ➌ Calendar day --------------------------------------------------- */
  if (dest.kind === 'calendar-day' && src.type === 'task') {
    const old = nodesById[src.nodeId].cells || {};
    updateNode(src.nodeId, {
      cells: {
        ...old,
        due: { start: `${dest.date}T00:00`, end: null },
      },
    });
    return;
  }
}
/* ----------------------------------------- */

export const AppProvider = ({ children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleGlobalDrop}
    >
      {children}
    </DndContext>
  );
};
