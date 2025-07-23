import { useState } from 'react';

export default function ProgressLogs({ tasks = [] }) {
  const [columns, setColumns] = useState();

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
