import React, { useState } from 'react';
import TaskView from './TaskView';

export default function ListView({ projectTasks, allTasks }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  return (
    <div>
      {projectTasks.map((task) => (
        <div
          key={task.id}
          className="mt-2 p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900"
          onClick={() => setSelectedTaskId(task.id)}
        >
          <div className="font-semibold">
            {task.fields.name || 'Untitled Task'}
          </div>
          <div>Status: {task.fields.status}</div>
          <div>Priority: {task.fields.priority}</div>
          <div>Due: {task.dueDate}</div>
          <div>
            Subtasks: {allTasks.filter((t) => t.parentId === task.id).length}
          </div>
        </div>
      ))}
      {selectedTaskId && (
        <TaskView
          taskId={selectedTaskId}
          mode="drawer"
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
