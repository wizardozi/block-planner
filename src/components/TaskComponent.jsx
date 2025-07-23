// components/TaskComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import BlockEditor from './BlockEditor';
import TaskProperties from './TaskProperties';
import { useTaskManager } from '../context/TaskContext';
import { loadDoc } from '../utils/editorStore';
import { DBProvider } from '../context/DBProvider';
import { useNode } from '../hooks/useNode';

export const TaskComponent = ({ taskData }) => {
  const { updateTask } = useTaskManager();
  const textareaRef = useRef(null);

  /* ──────────────────────────
     1  state: only id + fields
     ────────────────────────── */
  const [task, setTask] = useState(() => ({
    id: taskData.id,
    fields: taskData.fields ?? {},
  }));

  const { db } = useNode(task.id);

  /* auto-grow task-name textarea */
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [task.fields.name]);

  /* ──────────────────────────
     2  per-field change helpers
     ────────────────────────── */
  const handleChange = (key, value) =>
    setTask((prev) => ({
      ...prev,
      fields: { ...prev.fields, [key]: value },
    }));

  /* ──────────────────────────
     3  debounce + persist
     ────────────────────────── */
  const debouncedSave = useDebouncedCallback(() => {
    const latestBlocks = loadDoc('task', task.id); // plain JSON array
    updateTask({
      id: task.id,
      fields: task.fields,
      blocks: latestBlocks, // if your API expects it
    });
  }, 300);

  useEffect(() => {
    debouncedSave();
  }, [task, debouncedSave]);

  /* ──────────────────────────
     4  UI
     ────────────────────────── */
  return (
    <div className="">
      {/* Task Header & property inputs */}
      <div>
        <textarea
          ref={textareaRef}
          className="text-5xl font-bold outline-none w-full resize-none overflow-hidden leading-tight pl-13.5"
          style={{ height: '80px' }}
          value={task.fields.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="New Task"
        />
        {db ? (
          <DBProvider db={db}>
            <TaskProperties taskId={task.id} />
          </DBProvider>
        ) : (
          <div className="pl-13.5 text-sm text-red-500">
            No database found for this task.
          </div>
        )}
      </div>

      <div className=" flex-grow">
        <BlockEditor context="task" docId={task.id} />
      </div>
    </div>
  );
};

export default TaskComponent;
