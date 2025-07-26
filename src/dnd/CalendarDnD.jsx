import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { closestCenter } from '@dnd-kit/core';

import { useStore } from '../state/store';

/**
 * Wrap <CalendarGrid> with this component:
 *   <CalendarDnD><CalendarGrid … /></CalendarDnD>
 *
 * Every card (DraggableCalendarTask) must supply:
 *   data: { date: '2025-07-25' }          ← start date in YYYY-MM-DD
 *
 * CalendarDayCell already sets data: { date } on its droppable area.
 */
export default function CalendarDnD({ children }) {
  /* one basic sensor */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const updateNode = useStore((s) => s.updateNode);

  const handleDragEnd = ({ active, over }) => {
    if (!over || !active.data.current || !over.data.current) return;

    const srcTaskId = active.id.replace(/^calendar-task-/, '');

    // normalise to 'YYYY-MM-DD'
    const srcDate = active.data.current.date; // already string
    const dstDateObj = over.data.current.date; // Date object
    const dstDate =
      typeof dstDateObj === 'string'
        ? dstDateObj
        : dstDateObj.toISOString().split('T')[0];

    /* no change if dropped on the same day */
    if (srcDate === dstDate) return;

    /* ---------- update the task ---------- */
    const state = useStore.getState();
    const task = state.nodesById[srcTaskId];
    const oldDue = task.cells?.due || { start: null, end: null };

    /* preserve range length if it had an end */
    let newEnd = null;
    if (oldDue.end) {
      const delta =
        new Date(oldDue.end).getTime() - new Date(oldDue.start).getTime();
      const shifted = new Date(dstDate);
      shifted.setTime(shifted.getTime() + delta);
      newEnd = shifted.toISOString().split('T')[0] + 'T00:00';
    }

    const newDue = {
      start: dstDate + 'T00:00',
      end: newEnd,
    };

    updateNode(srcTaskId, {
      cells: { ...task.cells, due: newDue },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}
