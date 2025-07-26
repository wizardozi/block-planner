import { createContext, useContext, useEffect, useState } from 'react';
import { TaskManager } from '../utils/taskManager';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(TaskManager.loadTasks());
  }, []);

  const updateTask = ({ id, fields = {}, blocks, parentId }) => {
    const newTasks = tasks.map((t) => {
      if (t.id !== id) return t;

      return {
        ...t,
        parentId: parentId !== undefined ? parentId : t.parentId,
        fields: { ...t.fields, ...fields },
        blocks: blocks ?? t.blocks,
      };
    });

    setTasks(newTasks);
    TaskManager.saveTasks(newTasks);
  };

  const addTask = (task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    TaskManager.saveTasks(newTasks);
  };

  const deleteTask = (taskToDelete) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id));
  };

  const getTaskById = (id) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, updateTask, addTask, deleteTask, getTaskById }}
    >
      {children}
    </TaskContext.Provider>
  );
};
