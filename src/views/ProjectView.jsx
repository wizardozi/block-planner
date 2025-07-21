// src/views/ProjectView.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectManager } from '../context/ProjectContext';
import { useTaskManager } from '../context/TaskContext';
import BoardView from './BoardView';
import CalendarView from './CalendarView';
import ListView from './ListView';
import ContentHeader from '../components/ContentHeader';
import ProgressView from './ProgressView';

const ProjectView = () => {
  const [project, setProject] = useState(null);

  const { projectId } = useParams();

  const { projects, addProject, deleteProject, updateProject, getProjectById } =
    useProjectManager();

  const { tasks, setTasks, updateTask, addTask, deleteTask, getTaskById } =
    useTaskManager();

  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem(`viewType-${projectId}`);
    return saved || 'board';
  });

  useEffect(() => {
    if (projectId) {
      const savedView = localStorage.getItem(`viewType-${projectId}`);
      setCurrentView(savedView || 'board');
    }
  }, [projectId]);

  useEffect(() => {
    const foundProject = getProjectById(projectId);
    setProject(foundProject || null);
  }, [projectId, getProjectById]);

  const handleViewChange = (view) => {
    setCurrentView(view);
    localStorage.setItem(`viewType-${projectId}`, view);
  };

  const handleChange = (key, value) => {
    setProject((prev) => ({ ...prev, [key]: value }));
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateProject(project);
    }, 300);

    return () => clearTimeout(timeout);
  }, [project]);

  if (!project) return <div>Project not found.</div>;

  const filteredTasks = tasks.filter((t) => t.parentId === project.id);

  return (
    <div className="p-4">
      <ContentHeader />
      <textarea
        ref={textareaRef}
        className="text-5xl font-bold outline-none w-full resize-none overflow-hidden leading-tight"
        value={project.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        placeholder="New Project"
      />

      <div className="flex space-x-2 mb-4">
        <button
          className="flex p-1 transition  hover:bg-gray-50 hover:rounded-sm hover:text-black"
          onClick={() => handleViewChange('board')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
          Board
        </button>

        <button
          className="flex p-1 transition  hover:bg-gray-50 hover:rounded-sm hover:text-black"
          onClick={() => handleViewChange('list')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 mr-1"
          >
            <path
              fillRule="evenodd"
              d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z"
              clipRule="evenodd"
            />
          </svg>
          List
        </button>
        <button
          className="flex p-1 transition  hover:bg-gray-50 hover:rounded-sm hover:text-black"
          onClick={() => handleViewChange('calendar')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 mr-1"
          >
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
              clipRule="evenodd"
            />
          </svg>
          Calendar
        </button>
        <button
          className="flex p-1 transition  hover:bg-gray-50 hover:rounded-sm hover:text-black"
          onClick={() => handleViewChange('progress')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
            />
          </svg>
          Progress
        </button>
      </div>

      {currentView === 'board' && (
        <BoardView projectTasks={filteredTasks} allTasks={tasks} />
      )}
      {currentView === 'list' && (
        <ListView projectTasks={filteredTasks} allTasks={tasks} />
      )}
      {currentView === 'calendar' && (
        <CalendarView projectTasks={filteredTasks} allTasks={tasks} />
      )}
      {currentView === 'progress' && (
        <ProgressView projectTasks={filteredTasks} allTasks={tasks} />
      )}
    </div>
  );
};

export default ProjectView;
