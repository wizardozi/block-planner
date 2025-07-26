import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../state/store';
import { useMemo, useState, useRef, useEffect } from 'react';
import { buildTree } from '../utils/buildTree';
import { SidebarItem } from './SidebarItem';
import { DeparentDropZone } from './DeparentDropZone';

/* ---------- optional: global DnD helpers ---------- */
import {
  useDndMonitor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export default function Sidebar() {
  const navigate = useNavigate();

  /* ---------------- Zustand slices ---------------- */
  /* ——— state slices ——— */
  const nodesById = useStore((s) => s.nodesById);

  /* 1️⃣ new stable selector */
  const profilesById = useStore((s) => s.profilesById);

  /* 2️⃣ memoised array */
  const profiles = useMemo(() => Object.values(profilesById), [profilesById]);

  const addProfile = useStore((s) => s.addProfile);
  const addProject = useStore((s) => s.addProject);
  const addRootTask = useStore((s) => s.addRootTask);
  const addPage = useStore((s) => s.addPage);
  const deleteNode = useStore((s) => s.deleteNode);
  const moveNode = useStore((s) => s.moveNode);

  /* ---------------- Sidebar tree ------------------ */
  const tree = useMemo(() => {
    const nodes = Object.values(nodesById);
    const listing = [
      ...profiles,
      ...nodes.filter((n) => n.type === 'project'),
      ...nodes.filter((n) => n.type === 'task'),
      ...nodes.filter((n) => n.type === 'page'),
    ].map((n) => ({
      id: n.id,
      name:
        n.type === 'profile'
          ? n.name
          : n.type === 'project'
          ? n.title || 'Untitled Project'
          : n.cells?.name || 'Untitled Task',
      parentId: n.parentId ?? null,
      type: n.type,
      sort: n.sort ?? 0,
    }));

    return buildTree(listing);
  }, [nodesById, profiles]);

  /* ----------- expand / collapse state ------------ */
  const [expanded, setExpanded] = useState(() => {
    const stored = localStorage.getItem('sidebarExpanded');
    return stored ? JSON.parse(stored) : {};
  });
  const toggleExpand = (id) =>
    setExpanded((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('sidebarExpanded', JSON.stringify(next));
      return next;
    });

  /* ------------------ resizing -------------------- */
  const [width, setWidth] = useState(() =>
    parseInt(localStorage.getItem('sidebarWidth') || '256', 10)
  );
  const [resizing, setResizing] = useState(false);
  const isResizing = useRef(false);

  const onMouseMove = (e) => {
    if (!isResizing.current) return;
    const maxWidth = window.innerWidth * 0.75;
    const newWidth = Math.min(Math.max(180, e.clientX), maxWidth);
    setWidth(newWidth);
    localStorage.setItem('sidebarWidth', newWidth);
  };
  const onMouseUp = () => {
    isResizing.current = false;
    setResizing(false);
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  const handleResizerDown = () => {
    isResizing.current = true;
    setResizing(true);
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /* -------------- context-menu state -------------- */
  const [contextMenu, setContextMenu] = useState(null);
  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  /* --------------- drag-and-drop ------------------- */
  useDndMonitor({
    onDragEnd({ active, over }) {
      if (!over) return;
      const id = active.id.replace(/^sidebar-/, '');
      const targetId = over.id.replace(/^sidebar-/, '');

      if (id === targetId) return;
      moveNode(id, targetId, 0); // nest under the drop-target
    },
  });

  const getKey = (item) => `${item.type}-${item.id}`;

  /* --------------------- render ------------------- */
  return (
    <div className="flex border-r">
      <div
        style={{ width }}
        className={`p-4 h-screen relative ${resizing ? 'select-none' : ''}`}
      >
        {/* Top buttons */}
        <div className="flex justify-center mb-4">
          {/* + Task */}
          <button
            className="m-1 p-1 hover:bg-gray-100 rounded-md"
            onClick={() => {
              const id = addRootTask();
              navigate(`/task/${id}`);
            }}
          >
            +
          </button>
          {/* + Project */}
          <button
            className="m-1 p-1 hover:bg-gray-100 rounded-md"
            onClick={() => {
              const id = addProject();
              navigate(`/project/${id}`);
            }}
          >
            📁
          </button>
          {/* + Profile */}
          <button
            className="m-1 p-1 hover:bg-gray-100 rounded-md"
            onClick={() => {
              const name = prompt('Profile name?');
              if (name) addProfile(name);
            }}
          >
            👤
          </button>
        </div>

        {/* Tree */}
        {tree.map((item) => (
          <SidebarItem
            key={getKey(item)}
            item={item}
            expandedMap={expanded}
            toggleExpanded={toggleExpand}
            getItemKey={getKey}
            onContextMenu={(e) =>
              setContextMenu({ x: e.pageX, y: e.pageY, item })
            }
          />
        ))}

        <DeparentDropZone />

        {/* Context menu */}
        {contextMenu && (
          <div
            className="absolute z-50 border shadow-md text-sm bg-white"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              className="block px-4 py-2 hover:text-red-600"
              onClick={() => {
                deleteNode(contextMenu.item.id);
                setContextMenu(null);
              }}
            >
              Delete
            </button>
            {contextMenu.item.type !== 'page' && (
              <button
                className="block px-4 py-2 hover:text-green-600"
                onClick={() => {
                  const pageId = addPage(contextMenu.item.id);
                  setContextMenu(null);
                  navigate(`/page/${pageId}`);
                }}
              >
                Add Page
              </button>
            )}
          </div>
        )}

        {/* Resizer */}
        <div
          onMouseDown={handleResizerDown}
          className="absolute top-0 right-0 translate-x-[4px] h-full w-1 cursor-col-resize hover:bg-gray-200"
        />
      </div>
    </div>
  );
}
