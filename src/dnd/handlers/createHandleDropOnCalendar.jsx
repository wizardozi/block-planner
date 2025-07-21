export function createHandleDropOnCalendar({ getTaskById, updateTask }) {
  return function handleDropOnCalendar(draggedItem, targetItem) {
    if (draggedItem.type !== 'task') return;

    const task = getTaskById(draggedItem.id);

    if (!task) return;

    const dateMatch = targetItem.id.match(/^(\d{4}-\d{2}-\d{2})$/);

    if (!dateMatch) return;

    const newDate = dateMatch[1]; // e.g. "2025-07-21"

    updateTask({
      id: task.id,
      fields: {
        ...task.fields,
        due: {
          start: `${newDate}T00:00`,
          end: task.fields.due?.end ?? null,
        },
      },
      blocks: task.blocks,
      parentId: task.parentId, // don't change hierarchy
    });
  };
}
