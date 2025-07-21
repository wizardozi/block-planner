import React, { useState } from 'react';
import BoardCard from './BoardCard';
import { useTaskManager } from '../context/TaskContext';
import TaskView from '../views/TaskView';
import { useParams } from 'react-router-dom';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { SortableBoardCard } from './sortableBoardCard';

export default function BoardColumn({ status, tasks }) {
  const { projectId } = useParams();

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const { setTasks, updateTask, addTask, deleteTask, getTaskById } =
    useTaskManager();

  const { setNodeRef } = useDroppable({
    id: `board-column-${status}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="min-w-70 bg-gray-50 dark:bg-neutral-700 rounded-xs relative"
    >
      <div className="ml-3 font-bold">{status}</div>
      <button
        className="absolute right-3 top-1"
        onClick={() => {
          const newTask = {
            id: crypto.randomUUID(),
            type: 'task',
            fields: {
              name: '',
              status,
              priority: 'Medium',
            },
            parentId: projectId,
            blocks: [],
          };
          addTask(newTask);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <SortableContext
        id={`board-column-${status}`}
        items={tasks.map((task) => `board-task-${task.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="pt-2">
          {tasks.map((task) => (
            <SortableBoardCard
              key={task.id}
              id={`board-task-${task.id}`}
              task={task}
              onClick={() => setSelectedTaskId(task.id)}
            />
          ))}
          {selectedTaskId && (
            <TaskView
              taskId={selectedTaskId}
              mode="drawer"
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </div>
      </SortableContext>
    </div>
  );
}
