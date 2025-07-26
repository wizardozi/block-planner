// SidebarContext.js
import { createContext, useContext, useMemo } from 'react';
import { useProfileManager } from './ProfileContext';
import { useProjectManager } from './ProjectContext';
// import { useTaskManager } from './TaskContext';
import { usePageManager } from './PageContext';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const { pages } = usePageManager();
  const { profiles } = useProfileManager();
  const { projects } = useProjectManager();
  const { tasks } = useTaskManager();

  const sidebarItems = useMemo(() => {
    return [
      ...profiles.map((p) => ({
        id: p.id,
        name: p.name,
        type: 'profile',
      })),
      ...projects.map((p) => ({
        id: p.id,
        name: p.name,
        parentId: p.parentId || null,
        type: 'project',
      })),
      ...tasks.map((t) => ({
        id: t.id,
        name: t.fields?.name || 'Untitled Task', // updated
        parentId: t.parentId || null,
        type: 'task',
        blocks: [],
      })),
      ...pages.map((p) => ({
        id: p.id,
        name: p.name,
        parentId: p.parentId,
        type: 'page',
        blocks: [],
      })),
    ];
  }, [profiles, projects, tasks, pages]);

  return (
    <SidebarContext.Provider value={{ sidebarItems }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
