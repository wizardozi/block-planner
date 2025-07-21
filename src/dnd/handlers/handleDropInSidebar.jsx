export function createHandleDropInSidebar({
  getTaskById,
  updateTask,
  getProjectById,
  updateProject,
  getProfileById,
  updateProfile,
  getPageById,
  updatePage,
}) {
  return function handleDropInSidebar(draggedItem, targetItem) {
    if (!draggedItem || !targetItem) return;

    // Allow target.id to be null (dropzone-none), but still prevent self-drop
    if (
      draggedItem.id === targetItem.id &&
      draggedItem.type === targetItem.type
    )
      return;

    const { id: draggedId, type: draggedType } = draggedItem;
    const { id: targetId, type: targetType } = targetItem;

    // Prevent invalid nesting
    if (
      draggedType === 'profile' &&
      ['profile', 'project', 'task', 'page'].includes(targetType)
    )
      return;

    if (
      draggedType === 'project' &&
      ['project', 'task', 'page'].includes(targetType)
    )
      return;

    let originalItem = null;

    switch (draggedType) {
      case 'page':
        originalItem = getPageById(draggedId);
        break;
      case 'task':
        originalItem = getTaskById(draggedId);
        break;
      case 'project':
        originalItem = getProjectById(draggedId);
        break;
      case 'profile':
        originalItem = getProfileById(draggedId);
        break;
      default:
        return;
    }

    if (!originalItem) return;

    const updatedItem = {
      ...originalItem,
      parentId: targetId,
    };

    switch (draggedType) {
      case 'page':
        updatePage(updatedItem);
        break;
      case 'task':
        updateTask({
          id: draggedId,
          parentId: targetId, // will be null for "dropzone-none"
          fields: originalItem.fields,
          blocks: originalItem.blocks,
        });
        break;
      case 'project':
        updateProject(updatedItem);
        break;
      case 'profile':
        updateProfile(updatedItem);
        break;
      default:
    }
  };
}
