// components/TaskComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import BlockEditor from './BlockEditor';
import { TaskSchema } from '../data/TaskSchema';
import { useTaskManager } from '../context/TaskContext';
import { loadDoc } from '../utils/editorStore';

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
      {/* Task Header */}
      <div>
        <textarea
          ref={textareaRef}
          className="text-5xl font-bold outline-none w-full resize-none overflow-hidden leading-tight pl-13.5"
          style={{ height: '80px' }}
          value={task.fields.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="New Task"
        />
        {TaskSchema.map(({ key, type, options }) => (
          <div key={key} className="mb-2 pl-13.5">
            <label className="block font-medium capitalize">{key}</label>

            {type === 'text' && (
              <input
                type="text"
                className="border p-1 rounded outline-none"
                value={task.fields[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}

            {type === 'number' && (
              <input
                type="number"
                className="border p-1 rounded outline-none"
                value={task.fields[key] || ''}
                onChange={(e) => handleChange(key, Number(e.target.value))}
              />
            )}

            {type === 'select' && (
              <select
                className="border p-1 outline-none"
                value={task.fields[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                <option value="">Select</option>
                {options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {type === 'multi-select' && (
              <div className="flex flex-wrap gap-2">
                {options?.map((opt) => {
                  const selected = task.fields[key]?.includes(opt);
                  return (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          const current = task.fields[key] || [];
                          handleChange(
                            key,
                            e.target.checked
                              ? [...current, opt]
                              : current.filter((val) => val !== opt)
                          );
                        }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            )}

            {type === 'datetime' && (
              <>
                <input
                  type="datetime-local"
                  className="border p-1 rounded outline-none"
                  value={task.fields[key]?.start || ''}
                  onChange={(e) =>
                    handleChange(key, {
                      ...task.fields[key],
                      start: e.target.value,
                    })
                  }
                />
                {/* Optional end time input if range is allowed */}
                {options?.allowRange && (
                  <input
                    type="datetime-local"
                    className="border p-1 rounded outline-none mt-1"
                    value={task.fields[key]?.end || ''}
                    onChange={(e) =>
                      handleChange(key, {
                        ...task.fields[key],
                        end: e.target.value,
                      })
                    }
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className=" flex-grow">
        <BlockEditor context="task" docId={task.id} />
      </div>
    </div>
  );
};

export default TaskComponent;
