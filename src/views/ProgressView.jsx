import { useMemo } from 'react';

export default function ProgressView({ projectTasks = [] }) {
  const tasks = projectTasks;
  console.log('ProgressView tasks:', tasks);
  const total = tasks.length;
  const completed = useMemo(() => {
    return tasks.filter((task) => task.status === 'Done').length;
  }, [tasks]);

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">📊 Project Progress</h2>

      <div className="">
        Tasks completed: {completed} / {total}
      </div>

      <div className="w-full h-6 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-sm ">{percent}% complete</div>
    </div>
  );
}
