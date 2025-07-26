import { useEffect, useRef } from 'react';
import { useStore } from '../state/store';
import { useNode } from '../hooks/useNode';

import TaskProperties from './TaskProperties';
import BlockEditor from './BlockEditor';
import { DBProvider } from '../context/DBProvider';

export default function TaskComponent({ taskId }) {
  /* ------------------------------------------------------------- */
  /* 1 Pull live task + update helper from zustand                  */
  /* ------------------------------------------------------------- */
  const task = useStore((s) => s.nodesById[taskId]);
  const updateNode = useStore((s) => s.updateNode);

  /* graceful fallback */
  if (!task) return <div className="text-red-500">Task not found.</div>;

  /* ------------------------------------------------------------- */
  /* 2 Get the project-level database (if any)                      */
  /* ------------------------------------------------------------- */
  const { db } = useNode(taskId); // hook climbs parentId chain

  /* ------------------------------------------------------------- */
  /* 3 auto-grow the title textarea                                */
  /* ------------------------------------------------------------- */
  const titleRef = useRef(null);
  useEffect(() => {
    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }, [task.cells?.name]);

  /* shorthand to mutate one cell */
  const patchCell = (key, value) =>
    updateNode(task.id, {
      cells: { ...task.cells, [key]: value },
    });

  /* ------------------------------------------------------------- */
  /* 4 Render                                                       */
  /* ------------------------------------------------------------- */
  const core = (
    <>
      {/* task title */}
      <textarea
        ref={titleRef}
        className="text-5xl font-bold outline-none w-full resize-none overflow-hidden leading-tight pl-13.5"
        value={task.cells?.name || ''}
        onChange={(e) => patchCell('name', e.target.value)}
        placeholder="New Task"
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
      />

      {/* dynamic property panel */}
      {db ? (
        <TaskProperties taskId={task.id} />
      ) : (
        <div className="pl-13.5 text-sm text-red-500">
          No database found for this task.
        </div>
      )}

      {/* rich-text editor */}
      <div className="flex-grow">
        <BlockEditor context="task" docId={task.id} />
      </div>
    </>
  );

  /* wrap in DBProvider only when a db exists */
  return db ? <DBProvider db={db}>{core}</DBProvider> : core;
}
