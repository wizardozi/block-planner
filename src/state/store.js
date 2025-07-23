import { create } from 'zustand';
import { createDB } from '../models/db';
import { defaultFields } from '../data/defaultFields';

export const useStore = create((set, get) => ({
  /* data maps */
  dbsById: {},
  nodesById: {},

  /* ---------- PROJECT ---------- */
  addProject: () => {
    const projId = crypto.randomUUID();

    /* 1. create DB + seed default fields */
    const db = createDB('db-' + projId);
    db.fields = [...defaultFields];

    /* 2. commit DB + project node */
    set((s) => ({
      dbsById: {
        ...s.dbsById,
        [db.id]: db,
      },
      nodesById: {
        ...s.nodesById,
        [projId]: {
          id: projId,
          type: 'project',
          title: '',
          parentId: null,
          database: db.id, // ★ critical link
        },
      },
    }));

    return projId;
  },

  /* ---------- TASK / PAGE ---------- */
  addTask: (parentId) => {
    const dbId = get().nodesById[parentId]?.database;
    if (!dbId) throw new Error('Parent has no database');

    const db = get().dbsById[dbId];
    const taskId = crypto.randomUUID();

    /* seed every field */
    const cells = Object.fromEntries(
      db.fields.map((f) => [f.key, f.type === 'number' ? 0 : ''])
    );

    set((s) => ({
      nodesById: {
        ...s.nodesById,
        [taskId]: {
          id: taskId,
          type: 'task',
          parentId,
          cells,
        },
      },
    }));

    return taskId;
  },

  updateNode: (id, patch) =>
    set((s) => ({
      nodesById: {
        ...s.nodesById,
        [id]: { ...s.nodesById[id], ...patch },
      },
    })),
}));
