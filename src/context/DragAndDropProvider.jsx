// DragAndDropProvider.jsx
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useProfileManager } from '../context/ProfileContext';
import { useProjectManager } from '../context/ProjectContext';
import { useTaskManager } from '../context/TaskContext';
import { usePageManager } from './PageContext';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { pointerWithin } from '@dnd-kit/core';
import {
  getDropHandler,
  registerDropHandler,
} from '../dnd/dropHandlerRegistry';
import { createHandleDropInSidebar } from '../dnd/handlers/handleDropInSidebar';
import { createHandleDropOnColumn } from '../dnd/handlers/handleDropOnColumn';
import { createHandleDropOnCalendar } from '../dnd/handlers/createHandleDropOnCalendar';
import { parseDragId } from '../utils/dnd';

const DragAndDropContext = createContext();

export function DragAndDropProvider({ children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const { getProfileById, updateProfile } = useProfileManager();

  const { getProjectById, updateProject } = useProjectManager();

  const { getTaskById, updateTask } = useTaskManager();

  const { getPageById, updatePage } = usePageManager();

  const [activeDragItem, setActiveDragItem] = useState(null);
  const contextProps = {
    getTaskById,
    updateTask,
    getProjectById,
    updateProject,
    getProfileById,
    updateProfile,
    getPageById,
    updatePage,
  };
  useEffect(() => {
    const sidebarHandler = createHandleDropInSidebar(contextProps);
    registerDropHandler('sidebar', sidebarHandler);

    const columnHandler = createHandleDropOnColumn(contextProps);
    registerDropHandler('board', columnHandler);

    const calendarHandler = createHandleDropOnCalendar(contextProps);
    registerDropHandler('calendar', calendarHandler);
  }, [
    getTaskById,
    updateTask,
    getProjectById,
    updateProject,
    getProfileById,
    updateProfile,
  ]);

  const handleItemDrop = useCallback(
    (draggedItem, targetItem) => {
      if (!draggedItem || !targetItem || draggedItem.id === targetItem.id)
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
    },
    [
      getTaskById,
      getProjectById,
      getProfileById,
      updateTask,
      updateProject,
      updateProfile,
      getPageById,
      updatePage,
    ]
  );

  const handleDragStart = (event) => {
    setActiveDragItem(event.active);
  };
  const handleDragEnd = ({ active, over }) => {
    if (!active || !over) return;

    const draggedItem = parseDragId(active.id);
    const targetItem = parseDragId(over.id);

    // Ignore self-drop
    if (
      draggedItem.id === targetItem.id &&
      draggedItem.type === targetItem.type
    )
      return;

    // 🧠 Route to correct handler based on target context (sidebar, board, etc.)
    const handlerType = targetItem.context;
    const handler = getDropHandler(handlerType);

    if (handler) {
      handler(draggedItem, targetItem);
    } else {
      console.warn(
        `🚨 No drop handler registered for context: '${handlerType}'`
      );
    }

    setActiveDragItem(null);
  };

  return (
    <DragAndDropContext.Provider value={{ activeDragItem, handleItemDrop }}>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </DragAndDropContext.Provider>
  );
}

export function useDragAndDrop() {
  return useContext(DragAndDropContext);
}
