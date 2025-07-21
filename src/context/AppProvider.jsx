// src/context/AppProvider.jsx
import { ProfileProvider } from './ProfileContext';
import { ProjectProvider } from './ProjectContext';
import { TaskProvider } from './TaskContext';
import { SidebarProvider } from './SidebarContext'; // ✅ Import it
import { DragAndDropProvider } from './DragAndDropProvider';
import { PageProvider } from './PageContext';

export const AppProvider = ({ children }) => {
  return (
    <ProfileProvider>
      <ProjectProvider>
        <TaskProvider>
          <PageProvider>
            <DragAndDropProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </DragAndDropProvider>
          </PageProvider>
        </TaskProvider>
      </ProjectProvider>
    </ProfileProvider>
  );
};
