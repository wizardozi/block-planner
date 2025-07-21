import '../styles/Sidebar.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileManager } from '../context/ProfileContext';
import { useProjectManager } from '../context/ProjectContext';
import { usePageManager } from '../context/PageContext';
import { useTaskManager } from '../context/TaskContext';
import { SidebarItem } from './SidebarItem';
import { useSidebar } from '../context/SidebarContext';
import { buildTree } from '../utils/buildTree';
import { DeparentDropZone } from './DeparentDropZone';
import { useDragAndDrop } from '../context/DragAndDropProvider';
import { getField } from '../utils/getField';

import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export default function Sidebar() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved, 10) : 256;
  });

  const { handleItemDrop } = useDragAndDrop();

  const [resizing, setResizing] = useState(false);

  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem('sidebarExpanded');
    return stored ? JSON.parse(stored) : {};
  });

  const [contextMenu, setContextMenu] = useState(null);

  const { sidebarItems } = useSidebar();

  if (!Array.isArray(sidebarItems)) {
    console.error('🚨 sidebarItems is invalid:', sidebarItems);
    return null;
  }
  const sanitizedSidebarItems = sidebarItems.map((item) => {
    if (!item.type && item.task === 'task') {
      return { ...item, type: 'task' }; // convert corrupted tasks
    }
    if (!item.type && item.task === 'project') {
      return { ...item, type: 'project' }; // convert corrupted projects (if any)
    }
    if (!item.type && item.task === 'page') {
      return { ...item, type: 'page' }; // convert corrupted pages (if any)
    }

    return item;
  });
  const tree = buildTree(sanitizedSidebarItems);

  const { addProfile, deleteProfile } = useProfileManager();

  const { addProject, deleteProject } = useProjectManager();

  const { addPage, deletePage } = usePageManager();

  const { addTask, deleteTask } = useTaskManager();

  const sidebarRef = useRef(null);

  const isResizing = useRef(false);

  const getItemKey = (item) => `${item.type}-${item.id}`;

  const handleMouseDown = () => {
    isResizing.current = true;
    setResizing(true);
    document.body.classList.add('disable-select'); // ✅ prevent selection globally
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    setResizing(false);
    document.body.classList.remove('disable-select');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const maxWidth = window.innerWidth * 0.75;
    const newWidth = Math.min(Math.max(180, e.clientX), maxWidth);

    setWidth(newWidth);
    localStorage.setItem('sidebarWidth', newWidth);
  };

  const handleContextMenu = (event, item) => {
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      item,
    });
  };

  const handleDelete = () => {
    const { item } = contextMenu;

    switch (item.type) {
      case 'task':
        deleteTask(item);
        break;
      case 'project':
        deleteProject(item);
        break;
      case 'profile':
        deleteProfile(item);
        break;
      case 'page':
        deletePage(item);
        break;
      default:
        console.warn(`Unhandled delete type: ${item.type}`);
    }

    setContextMenu(null);
  };
  const handleAddPage = () => {
    const { item } = contextMenu;

    const newPage = {
      id: crypto.randomUUID(),
      name: '',
      type: 'page',
      parentId: item.id,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: 'paragraph',
          props: {},
          content: [{ type: 'text', text: '', styles: {} }],
          children: [],
        },
      ],
    };
    addPage(newPage);
    setContextMenu(null);
    navigate(`/page/${newPage.id}`);
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleToggleExpanded = (id) => {
    setIsExpanded((prev) => {
      const updated = {
        ...prev,
        [id]: !prev[id],
      };
      localStorage.setItem('sidebarExpanded', JSON.stringify(updated));
      return updated;
    });
  };
  return (
    <div className="flex border-r">
      <div
        ref={sidebarRef}
        style={{ width }}
        className={` p-4  h-screen relative  ${resizing ? 'select-none' : ''}`}
      >
        {/* Task Button */}
        <div className="flex justify-center mb-4 ">
          <button
            className="m-1 group p-1 hover:bg-gray-100 rounded-md transition-colors "
            onClick={() => {
              const newTask = {
                id: crypto.randomUUID(),
                type: 'task',
                fields: {
                  name: '',
                  status: 'Not Started',
                  priority: 'Medium',
                },
                parentId: null,
                blocks: [], // ← This was missing
              };

              addTask(newTask);
              console.log(newTask);
              navigate(`/task/${newTask.id}`);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5 p-0 transition-colors hover:fill-black"
            >
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
          </button>
          {/* Project Button */}
          <button
            className="m-1 group p-1 hover:bg-gray-100 rounded-md transition-colors "
            onClick={() => {
              const newProject = {
                id: crypto.randomUUID(),
                name: '',
                type: 'project',
                parentId: null,
              };
              addProject(newProject);
              navigate(`/project/${newProject.id}`);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5 p-0 transition-colors hover:fill-black"
            >
              <path
                fillRule="evenodd"
                d="M3.75 3A1.75 1.75 0 0 0 2 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-8.5A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* Profile button */}
          <button
            className="m-1 group p-1 hover:bg-gray-100 rounded-md transition-colors "
            onClick={() => {
              const name = prompt('Enter new profile name:');
              if (name)
                addProfile({
                  id: crypto.randomUUID(),
                  name,
                  type: 'profile',
                });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5 p-0 transition-colors hover:fill-black"
            >
              <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h2.5A2.25 2.25 0 0 1 9 4.25v2.5A2.25 2.25 0 0 1 6.75 9h-2.5A2.25 2.25 0 0 1 2 6.75v-2.5ZM2 13.25A2.25 2.25 0 0 1 4.25 11h2.5A2.25 2.25 0 0 1 9 13.25v2.5A2.25 2.25 0 0 1 6.75 18h-2.5A2.25 2.25 0 0 1 2 15.75v-2.5ZM11 4.25A2.25 2.25 0 0 1 13.25 2h2.5A2.25 2.25 0 0 1 18 4.25v2.5A2.25 2.25 0 0 1 15.75 9h-2.5A2.25 2.25 0 0 1 11 6.75v-2.5ZM15.25 11.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
            </svg>
          </button>
        </div>
        <div className="">
          {tree.map((item) => (
            <SidebarItem
              key={getItemKey(item)}
              item={item}
              expandedMap={isExpanded}
              toggleExpanded={handleToggleExpanded}
              getItemKey={getItemKey}
              onItemDrop={handleItemDrop}
              onContextMenu={handleContextMenu}
            />
          ))}
        </div>
        {/* ➕ Add this: "No Parent" drop zone */}
        <DeparentDropZone />
        {contextMenu && (
          <div
            className="absolute z-50 border shadow-md text-sm bg-white dark:bg-neutral-700"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={() => setContextMenu(null)}
          >
            <button
              onClick={handleDelete}
              className="block px-4 py-2 hover:text-red-600 "
            >
              Delete
            </button>
            <button
              onClick={handleAddPage}
              className="block px-4 py-2 hover:text-green-600"
            >
              Add Page
            </button>
          </div>
        )}
        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 translate-x-[4px] h-full w-1 transition hover:bg-gray-200  cursor-col-resize"
        />
      </div>
    </div>
  );
}
