export default function ProgressLogs({ tasks = [] }) {
  return (
    <div>
      {tasks.map((task) => (
        <ul key={task.id}>
          <li>{task.cells?.name || 'Untitled'}</li>
        </ul>
      ))}
    </div>
  );
}
