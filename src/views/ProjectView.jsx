// src/views/ProjectView.jsx
import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useStore } from '../state/store'; // NEW zustand
import { useNode } from '../hooks/useNode'; // selector {node, db, children}
import { DBProvider } from '../context/DBProvider'; // supplies useDB()

import ContentHeader from '../components/ContentHeader';
import BoardView from './BoardView';
import ListView from './ListView';
import CalendarView from './CalendarView';
import ProgressView from './ProgressView';

const VIEW_KEY = (id) => `viewType-${id}`;

export default function ProjectView() {
  /* ---------- always‐run hooks ---------- */
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { node: project, db, children } = useNode(projectId); // may be undefined on 1st render
  const tasks = children.filter((c) => c.type === 'task');

  const addTask = useStore((s) => s.addTask);
  const updateNode = useStore((s) => s.updateNode);

  /* UI mode (board / list / calendar / progress) */
  const [view, setView] = useState(
    () => localStorage.getItem(VIEW_KEY(projectId)) || 'board'
  );
  useEffect(() => {
    localStorage.setItem(VIEW_KEY(projectId), view);
  }, [view, projectId]);

  /* auto-grow title textarea even if title is '' at first */
  const titleRef = useRef(null);
  useEffect(() => {
    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }, [project?.title]); // use optional chaining

  /* pick the main view */
  const viewBody = useMemo(() => {
    switch (view) {
      case 'list':
        return <ListView projectTasks={tasks} />;
      case 'calendar':
        return <CalendarView projectTasks={tasks} />;
      case 'progress':
        return <ProgressView projectTasks={tasks} />;
      default:
        return <BoardView projectTasks={tasks} />;
    }
  }, [view, tasks]);

  /* ---------- render ---------- */
  if (!project) {
    /* Data hasn’t arrived yet; still call every hook, just show a placeholder */
    return <div className="p-4">Loading project…</div>;
  }

  /* Once the project exists, wrap the UI in DBProvider as before */
  const handleTitle = (e) => updateNode(project.id, { title: e.target.value });
  const handleAddTask = () => {
    const id = addTask(project.id);
    navigate(`/task/${id}`);
  };

  /* ---------- render ---------- */
  return (
    <DBProvider db={db}>
      <div className="p-4">
        <ContentHeader />

        <textarea
          ref={titleRef}
          className="text-5xl font-bold outline-none w-full resize-none overflow-hidden leading-tight"
          value={project.title || ''}
          onChange={handleTitle}
          placeholder="New Project"
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        />

        <div className="flex gap-2 my-4">
          <ViewButton
            label="Board"
            icon="columns"
            id="board"
            view={view}
            setView={setView}
          />
          <ViewButton
            label="List"
            icon="list"
            id="list"
            view={view}
            setView={setView}
          />
          <ViewButton
            label="Calendar"
            icon="calendar"
            id="calendar"
            view={view}
            setView={setView}
          />
          <ViewButton
            label="Progress"
            icon="chart"
            id="progress"
            view={view}
            setView={setView}
          />
          <button
            className="ml-auto px-2 py-1 bg-blue-500 text-white rounded"
            onClick={handleAddTask}
          >
            + Task
          </button>
        </div>

        {viewBody}
      </div>
    </DBProvider>
  );
}

/* ---------------------------------------------- */
/* tiny reusable button                           */
function ViewButton({ id, label, icon, view, setView }) {
  const active = view === id;
  return (
    <button
      className={`flex items-center gap-1 px-2 py-1 rounded
                  ${active ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-50'}`}
      onClick={() => setView(id)}
    >
      {label}
    </button>
  );
}
