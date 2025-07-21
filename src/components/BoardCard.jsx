export default function BoardCard({ task }) {
  return (
    <div className="bg-white  dark:bg-neutral-800 min-h-20 mx-1 my-1 rounded-xs shadow-xs hover:shadow-sm relative p-3 dark:hover:bg-neutral-900 ">
      <h3 className={`mb-6`}>{task.fields?.name || 'Unititled Task'}</h3>
      <div className="absolute bottom-2 left-3 text-sm text-gray-500 dark:text-neutral-400 ">
        task data
      </div>
    </div>
  );
}
