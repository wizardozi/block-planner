// src/views/ProgressView.jsx
import { useMemo, useState } from 'react';
import { ProgressHeader } from '../components/ProgressHeader';
import { ProgressCharts } from '../components/ProgressCharts';
import ProgressLogs from '../components/ProgressLogs';

export default function ProgressView({ projectTasks = [] }) {
  const tasks = projectTasks;

  // ① parent owns the view mode
  const [mode, setMode] = useState('Logs'); // 'Logs' | 'Charts'

  const total = tasks.length;
  const completed = useMemo(
    () => tasks.filter((t) => t.status === 'Done').length,
    [tasks]
  );
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="p-6 space-y-4">
      {/* ② pass current mode + callback */}
      <ProgressHeader mode={mode} onChange={setMode} />

      {/* ③ switch the body */}
      {mode === 'Logs' && <ProgressLogs tasks={tasks} />}

      {mode === 'Charts' && (
        <ProgressCharts tasks={tasks} /> // already shows the chart
      )}
    </div>
  );
}
