import BoardColumn from './BoardColumn';
import React, { useState, useEffect } from 'react';
import { TaskSchema } from '../data/TaskSchema';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export default function Board({ tasks }) {
  const [columns, setColumns] = useState({});

  const statusOptions =
    TaskSchema.find((f) => f.key === 'status')?.options || [];

  useEffect(() => {
    const saved = localStorage.getItem('board-columns');
    const initialColumns = {};

    // Initialize columns from schema
    statusOptions.forEach((status) => {
      initialColumns[status] = [];
    });

    // If there's saved order, apply it
    if (saved) {
      const savedOrder = JSON.parse(saved);

      for (const status of statusOptions) {
        const ids = savedOrder[status] || [];
        const orderedTasks = ids
          .map((id) => tasks.find((t) => t.id === id))
          .filter(Boolean); // filter out missing tasks
        initialColumns[status] = orderedTasks;
      }

      // Add any tasks not in savedOrder (e.g. newly added tasks)
      tasks.forEach((task) => {
        let col = initialColumns[task.status || 'Not Started'];
        if (!col) {
          // Recover gracefully if task.status is unknown or malformed
          col = initialColumns['Not Started'] =
            initialColumns['Not Started'] || [];
        }
        if (!col.some((t) => t.id === task.id)) {
          col.push(task);
        }
      });
    } else {
      // No saved state, just distribute normally
      tasks.forEach((task) => {
        const status = task.fields?.status || 'Not Started';
        initialColumns[status].push(task);
      });
    }

    setColumns(initialColumns);
  }, [tasks]);

  const getColumnStatusFrom = (droppableId) => {
    if (!droppableId?.startsWith('column-')) return null;
    return droppableId.replace('column-', '');
  };

  const persistColumns = (columnsToSave) => {
    const idColumns = Object.fromEntries(
      Object.entries(columnsToSave).map(([status, taskList]) => [
        status,
        taskList.map((t) => t.id),
      ])
    );
    localStorage.setItem('board-columns', JSON.stringify(idColumns));
  };

  return (
    <div className="flex gap-2">
      {Object.entries(columns).map(([status, tasks]) => (
        <BoardColumn key={status} status={status} tasks={tasks} />
      ))}
    </div>
  );
}
