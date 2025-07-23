import React from 'react';

export default function ProgressLogs({ tasks = [] }) {
  return (
    <div>
      {tasks.map((task) => (
        <ul key={task.id}>
          <li>{task.fields.name}</li>
        </ul>
      ))}
    </div>
  );
}
