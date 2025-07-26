import React, { useRef, useEffect } from 'react';
import { useDB } from '../context/DBProvider';
import { useStore } from '../state/store';

/**
 * Props
 *   taskId  – the node.id of this task / page
 *   showTitle – optional (default true). If false you render your own header.
 */
export default function TaskProperties({ taskId, showTitle = false }) {
  const db = useDB(); // inherited schema
  const task = useStore((s) => s.nodesById[taskId]); // current row
  const update = useStore((s) => s.updateNode);

  /* auto-grow title textarea */
  const titleRef = useRef(null);
  useEffect(() => {
    if (!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }, [task.cells.name]);

  const handleChange = (key, value) =>
    update(taskId, { cells: { ...task.cells, [key]: value } });

  return (
    <div>
      {showTitle && (
        <textarea
          ref={titleRef}
          className="text-5xl font-bold outline-none w-full resize-none overflow-hidden leading-tight pl-13.5"
          style={{ height: '80px' }}
          value={task.cells.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="New Task"
        />
      )}

      {db.fields // iterate the schema
        .filter((f) => f.key !== 'name')
        .map(({ key, type, options }) => (
          <div key={key} className="mb-2 pl-13.5">
            <label className="block font-medium capitalize">{key}</label>

            {type === 'text' && (
              <input
                className="border p-1 rounded outline-none"
                value={task.cells[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}

            {type === 'number' && (
              <input
                type="number"
                className="border p-1 rounded outline-none"
                value={task.cells[key] ?? ''}
                onChange={(e) => handleChange(key, Number(e.target.value))}
              />
            )}

            {type === 'select' && (
              <select
                className="border p-1 outline-none"
                value={task.cells[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                <option value="">Select</option>
                {options?.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            )}

            {type === 'multi' && (
              <div className="flex flex-wrap gap-2">
                {options?.map((opt) => {
                  const selected = task.cells[key]?.includes(opt);
                  return (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          const cur = task.cells[key] || [];
                          handleChange(
                            key,
                            e.target.checked
                              ? [...cur, opt]
                              : cur.filter((v) => v !== opt)
                          );
                        }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            )}

            {/* DATE & DATETIME */}
            {(type === 'date' || type === 'datetime') && (
              <>
                <input
                  type="datetime-local"
                  className="border p-1 rounded outline-none"
                  value={task.cells[key]?.start || ''}
                  onChange={(e) => {
                    const next = {
                      ...(task.cells[key] || { end: null }),
                      start: e.target.value,
                    };
                    handleChange(key, next);
                  }}
                />
                {options?.allowRange && (
                  <>
                    <span className="mx-1">→</span>
                    <input
                      type="datetime-local"
                      className="border p-1 rounded outline-none"
                      value={task.cells[key]?.end || ''}
                      onChange={(e) => {
                        const next = {
                          ...(task.cells[key] || { start: null }),
                          end: e.target.value,
                        };
                        handleChange(key, next);
                      }}
                    />
                  </>
                )}
              </>
            )}
          </div>
        ))}
    </div>
  );
}
