import { create } from 'zustand';
import { createDB } from '../models/db';
import { defaultFields } from '../data/defaultFields';

export const useStore = create((set, get) => ({
  dbsById: {}, // dbId -> db
  nodesById: {}, // task | page | project

  /* ---------- bootstrap ---------- */
  addProject: (title) => {
    const projId = crypto.randomUUID();
    const db = createDB('db-' + projId);
    db.fields = [...defaultFields];
    set((s) => ({
      dbsById: { ...s.dbsById, [db.id]: db },
      nodesById: {
        ...s.nodesById,
        [projId]: {
          id: projId,
          type: 'project',
          title,
          database: db.id,
          parentId: null,
        },
      },
    }));
    return projId;
  },

  /* ---------- node helpers ---------- */
  addTask: (parentId) => {
    const parent = get().nodesById[parentId];
    const db = get().dbsById[parent.database];
    const taskId = crypto.randomUUID();
    const newTask = {
      id: taskId,
      type: 'task',
      parentId,
      cells: Object.fromEntries(db.fields.map((f) => [f.key, ''])),
    };
    set((s) => ({
      nodesById: { ...s.nodesById, [taskId]: newTask },
    }));
  },

  updateNode: (id, patch) =>
    set((s) => ({
      nodesById: { ...s.nodesById, [id]: { ...s.nodesById[id], ...patch } },
    })),
}));
