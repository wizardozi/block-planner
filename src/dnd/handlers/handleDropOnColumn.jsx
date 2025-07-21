export function createHandleDropOnColumn({ getTaskById, updateTask }) {
  return function handleDropOnColumn(draggedItem, targetItem) {
    if (draggedItem.type !== 'task') return;
    console.log(draggedItem);
    const task = getTaskById(draggedItem.id);
    if (!task) return;

    let newStatus;
    if (targetItem.type === 'column') {
      newStatus = targetItem.id;
    } else if (targetItem.type === 'task') {
      const targetTask = getTaskById(targetItem.id);
      newStatus = targetTask.fields?.status || task.fields.status;
    } else {
      newStatus = task.fields.status; // fallback
    }

    updateTask({
      id: task.id,
      fields: {
        ...task.fields,
        status: newStatus,
      },
      blocks: task.blocks,
      parentId: task.parentId,
    });
  };
}
