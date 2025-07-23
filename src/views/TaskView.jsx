import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskManager } from '../context/TaskContext';
import { TaskComponent } from '../components/TaskComponent';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../components/ContentHeader';
import PortalWrapper from '../components/PortalWrapper';
import { useNode } from '../hooks/useNode';
import { DBProvider } from '../context/DBProvider';

const TaskView = ({ taskId: propTaskId, mode = 'page', onClose }) => {
  const modalRef = useRef();

  const navigate = useNavigate();

  const params = useParams();

  const [task, setTask] = useState(null);

  const [viewMode, setViewMode] = useState(mode);

  const taskId = propTaskId || params.taskId;
  const { db } = useNode(taskId);

  const { getTaskById, updateTask } = useTaskManager();

  useEffect(() => {
    const foundTask = getTaskById(taskId);
    setTask(foundTask || null);
  }, [taskId, getTaskById]);

  useEffect(() => {
    if (viewMode === 'page' && propTaskId) {
      navigate(`/task/${propTaskId}`);
    }
  }, [viewMode, propTaskId, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'Escape' &&
        (viewMode === 'modal' || viewMode === 'drawer')
      ) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, onClose]);

  if (!task) return <div className="p-4 text-gray-500">Task not found.</div>;

  const content = (
    <DBProvider db={db}>
      <TaskComponent
        key={task.id}
        taskData={task}
        onUpdate={(newData) => updateTask(task.id, newData)}
      />
    </DBProvider>
  );

  // 🔄 Decide layout based on mode
  if (viewMode === 'modal') {
    return (
      <PortalWrapper>
        <div
          className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              onClose?.();
            }
          }}
        >
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-neutral-800 p-6 rounded-sm max-w-2xl w-full shadow-md"
            onDoubleClick={(e) => e.stopPropagation()} // Prevent bubbling
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            {content}
            <div className="absolute top-2 left-2">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border border-gray-200  px-2 py-1 text-sm shadow-none"
              >
                <option value="modal">Modal</option>
                <option value="drawer">Drawer</option>
                <option value="page">Page</option>
              </select>
            </div>
          </div>
        </div>
      </PortalWrapper>
    );
  }

  if (viewMode === 'drawer') {
    return (
      <PortalWrapper>
        <div
          className="fixed inset-0 z-50"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              onClose?.();
            }
          }}
        >
          <div
            ref={modalRef}
            className="absolute top-0 right-0 h-full w-[60%] bg-white dark:bg-neutral-800 shadow-md p-4"
            onDoubleClick={(e) => e.stopPropagation()} // Prevent bubbling
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            <div className="flex flex-col gap-4 w-full h-full">{content}</div>
            <div className="absolute top-2 left-2">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="modal">Modal</option>
                <option value="drawer">Drawer</option>
                <option value="page">Page</option>
              </select>
            </div>
          </div>
        </div>
      </PortalWrapper>
    );
  }

  return (
    <div className="relative p-4">
      <ContentHeader />
      {content}
    </div>
  );
};

export default TaskView;
