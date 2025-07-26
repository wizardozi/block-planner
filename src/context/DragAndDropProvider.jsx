import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createContext, useContext, useState } from 'react';
import { useStore } from '../state/store';

/* ------------------------------------------------------------------ */
/*  Context wrapper – exposes sensors + the id of the item in flight  */
/* ------------------------------------------------------------------ */

const DndCtx = createContext(null);

const getState = useStore.getState;

export function DragAndDropProvider({ children }) {
  /* dnd-kit sensors */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  /* zustand helpers */
  const moveNode = useStore((s) => s.moveNode);
  const updateNode = useStore((s) => s.updateNode); // you might use this later

  /* keep track of what’s being dragged (sidebar uses it for styling) */
  const [activeId, setActiveId] = useState(null);

  /* -------- drag start / end -------- */
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const typeCanContain = (parentType, childType) => {
    if (!parentType) return true; // root node
    if (parentType === 'profile') return childType !== 'profile';
    if (parentType === 'project')
      return childType === 'task' || childType === 'page';
    if (parentType === 'task')
      return childType === 'task' || childType === 'page';
    if (parentType === 'page') return true; // everything allowed in pages
    return false;
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const src = active.id.toString();
    const dst = over.id.toString();

    const { moveNode, updateNode } = getState(); // from Zustand

    /* -------------------------------- Sidebar nesting */
    if (src.startsWith('sidebar-node-') && dst.startsWith('sidebar-node-')) {
      const draggedId = src.slice('sidebar-node-'.length);
      const targetId = dst.slice('sidebar-node-'.length);
      if (draggedId !== targetId) moveNode(draggedId, targetId, 0);
      return;
    }

    /* -------------------------------- Board ➜ Column status change */
    if (dst.startsWith('board-col-')) {
      const taskId = src.replace(/^.*-task-/, ''); // picks board or calendar card
      const status = dst.slice('board-col-'.length);
      updateNode(taskId, { cells: { status } });
      return;
    }

    /* -------------------------------- Calendar reschedule */
    if (dst.startsWith('calendar-cell-')) {
      const taskId = src.replace(/^.*-task-/, '');
      const dayStr = dst.slice('calendar-cell-'.length); // YYYY-MM-DD
      updateNode(taskId, {
        cells: { due: { start: `${dayStr}T00:00`, end: null } },
      });
      return;
    }

    /* Add more target types here as needed */
  };

  return (
    <DndCtx.Provider value={{ sensors, activeId }}>{children}</DndCtx.Provider>
  );
}

/* hook for consumers (Sidebar, Board, Calendar…) */
export const useDragAndDrop = () => useContext(DndCtx);
