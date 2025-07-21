// src/types/Task.ts
export interface Task {
  id: string;
  name: string;
  dueDate?: string; // ISO string format
  hours?: number;
  status?: 'Not Started' | 'In Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High';
  blocks?: Block[]; // if you're planning to store blocks here
  [key: string]: any; // for extra custom properties
}
