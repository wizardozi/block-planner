// import { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useTaskManager } from '../context/TaskContext';
// import { TaskComponent } from '../components/TaskComponent';
// import { useNavigate } from 'react-router-dom';
// import ContentHeader from '../components/ContentHeader';
// import PortalWrapper from '../components/PortalWrapper';
// import { useNode } from '../hooks/useNode';
// import { DBProvider } from '../context/DBProvider';

// const TaskView = ({ taskId: propTaskId, mode = 'page', onClose }) => {
//   const modalRef = useRef();

//   const navigate = useNavigate();

//   const params = useParams();

//   const [task, setTask] = useState(null);

//   const [viewMode, setViewMode] = useState(mode);

//   const taskId = propTaskId || params.taskId;
//   const { db } = useNode(taskId);

//   const { getTaskById, updateTask } = useTaskManager();

//   useEffect(() => {
//     const foundTask = getTaskById(taskId);
//     setTask(foundTask || null);
//   }, [taskId, getTaskById]);

//   useEffect(() => {
//     if (viewMode === 'page' && propTaskId) {
//       navigate(`/task/${propTaskId}`);
//     }
//   }, [viewMode, propTaskId, navigate]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (
//         e.key === 'Escape' &&
//         (viewMode === 'modal' || viewMode === 'drawer')
//       ) {
//         onClose?.();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [viewMode, onClose]);

//   if (!task) return <div className="p-4 text-gray-500">Task not found.</div>;

//   const content = (
//     <DBProvider db={db}>
//       <TaskComponent
//         key={task.id}
//         taskData={task}
//         onUpdate={(newData) => updateTask(task.id, newData)}
//       />
//     </DBProvider>
//   );

//   // 🔄 Decide layout based on mode
//   if (viewMode === 'modal') {
//     return (
//       <PortalWrapper>
//         <div
//           className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center"
//           onClick={(e) => {
//             if (modalRef.current && !modalRef.current.contains(e.target)) {
//               onClose?.();
//             }
//           }}
//         >
//           <div
//             ref={modalRef}
//             className="relative bg-white dark:bg-neutral-800 p-6 rounded-sm max-w-2xl w-full shadow-md"
//             onDoubleClick={(e) => e.stopPropagation()} // Prevent bubbling
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
//             >
//               ×
//             </button>
//             {content}
//             <div className="absolute top-2 left-2">
//               <select
//                 value={viewMode}
//                 onChange={(e) => setViewMode(e.target.value)}
//                 className="border border-gray-200  px-2 py-1 text-sm shadow-none"
//               >
//                 <option value="modal">Modal</option>
//                 <option value="drawer">Drawer</option>
//                 <option value="page">Page</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </PortalWrapper>
//     );
//   }

//   if (viewMode === 'drawer') {
//     return (
//       <PortalWrapper>
//         <div
//           className="fixed inset-0 z-50"
//           onClick={(e) => {
//             if (modalRef.current && !modalRef.current.contains(e.target)) {
//               onClose?.();
//             }
//           }}
//         >
//           <div
//             ref={modalRef}
//             className="absolute top-0 right-0 h-full w-[60%] bg-white dark:bg-neutral-800 shadow-md p-4"
//             onDoubleClick={(e) => e.stopPropagation()} // Prevent bubbling
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
//             >
//               ×
//             </button>
//             <div className="flex flex-col gap-4 w-full h-full">{content}</div>
//             <div className="absolute top-2 left-2">
//               <select
//                 value={viewMode}
//                 onChange={(e) => setViewMode(e.target.value)}
//                 className="border border-gray-300 rounded px-2 py-1 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="modal">Modal</option>
//                 <option value="drawer">Drawer</option>
//                 <option value="page">Page</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </PortalWrapper>
//     );
//   }

//   return (
//     <div className="relative p-4">
//       <ContentHeader />
//       {content}
//     </div>
//   );
// };

// export default TaskView;

// src/views/TaskView.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useNode } from '../hooks/useNode';
import ContentHeader from '../components/ContentHeader';
import TaskComponent from '../components/TaskComponent';
import PortalWrapper from '../components/PortalWrapper';

/* ------------------------------------------------------------- */
/* TaskView can be a full page, a center modal, or a side drawer */
/* ------------------------------------------------------------- */

export default function TaskView({ taskId: propId, mode = 'page', onClose }) {
  const urlId = useParams().taskId;
  const taskId = propId || urlId; // prefer prop if supplied
  const nav = useNavigate();

  const { node: task } = useNode(taskId); // db handled inside TaskComponent
  const [viewMode, setViewMode] = useState(mode);

  /* autofocus title when component mounts */
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current?.focus();
  }, [taskId]);

  /* Esc closes modal/drawer */
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && viewMode !== 'page' && onClose?.();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [viewMode, onClose]);

  /* switch from modal → page */
  useEffect(() => {
    if (viewMode === 'page' && propId) nav(`/task/${propId}`);
  }, [viewMode, propId, nav]);

  /* graceful placeholder */
  if (!task) return <div className="p-4 text-gray-500">Loading task…</div>;

  /* ------------------------------------------------------------------ */
  /* content to render in any container                                  */
  /* ------------------------------------------------------------------ */
  const core = (
    <div ref={titleRef}>
      <TaskComponent taskId={task.id} />
    </div>
  );

  /* ---------- layout wrappers ---------- */
  if (viewMode === 'modal') {
    return (
      <PortalWrapper>
        <Backdrop onClick={onClose}>
          <ModalPanel>
            <CloseBtn onClick={onClose} />
            <ModeSelect value={viewMode} onChange={setViewMode} />
            {core}
          </ModalPanel>
        </Backdrop>
      </PortalWrapper>
    );
  }

  if (viewMode === 'drawer') {
    return (
      <PortalWrapper>
        <Backdrop onClick={onClose}>
          <DrawerPanel>
            <CloseBtn onClick={onClose} />
            <ModeSelect value={viewMode} onChange={setViewMode} />
            {core}
          </DrawerPanel>
        </Backdrop>
      </PortalWrapper>
    );
  }

  /* page mode */
  return (
    <div className="relative p-4">
      <ContentHeader />
      {core}
    </div>
  );
}

/* ---------- tiny helpers ---------- */

function Backdrop({ children, onClick }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
const ModalPanel = (p) => (
  <div {...p} className="bg-white p-6 rounded-sm relative max-w-2xl w-full" />
);
const DrawerPanel = (p) => (
  <div {...p} className="absolute right-0 top-0 h-full w-[60%] bg-white p-4" />
);
const CloseBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
  >
    ×
  </button>
);
function ModeSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute top-2 left-2 border px-2 py-1 text-sm shadow-none"
    >
      <option value="modal">Modal</option>
      <option value="drawer">Drawer</option>
      <option value="page">Page</option>
    </select>
  );
}
