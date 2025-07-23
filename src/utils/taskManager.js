const STORAGE_KEY = 'tasks';

export const TaskManager = {
  loadTasks: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTasks: (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  addTask: (newTask) => {
    const tasks = TaskManager.loadTasks();
    tasks.push(newTask);
    TaskManager.saveTasks(tasks);
    return newTask;
  },

  updateTask: (updatedTask) => {
    const tasks = TaskManager.loadTasks().map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    TaskManager.saveTasks(tasks);
  },
};
