// src/state/store.js
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createDB } from '../models/db';
import { defaultFields } from '../data/defaultFields';

/* ------------------------------------------------------------- */
/*  GLOBAL STORE – one map for every object                       */
/* ------------------------------------------------------------- */
export const useStore = create(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        /* ---------- DATA MAPS ---------- */
        dbsById: {}, // db.id    -> db object
        nodesById: {}, // node.id  -> project | task | page
        profilesById: {}, // profile.id -> profile object

        /* ---------- HELPERS ---------- */
        _nextSort(parentId) {
          return Object.values(get().nodesById).filter(
            (n) => n.parentId === parentId
          ).length;
        },

        /* ---------- PROJECT ---------- */
        addProject() {
          const projId = crypto.randomUUID();

          // 1) create a fresh DB with default columns
          const db = createDB('db-' + projId);
          db.fields = [...defaultFields];

          // 2) commit
          set((s) => {
            s.dbsById[db.id] = db;
            s.nodesById[projId] = {
              id: projId,
              type: 'project',
              title: '',
              parentId: null,
              database: db.id,
              sort: get()._nextSort(null),
            };
          });

          return projId;
        },

        /* ---------- TASK ---------- */
        addTask(parentId, initialCells = {}) {
          const dbId = get().nodesById[parentId]?.database;
          if (!dbId) throw new Error('Parent has no database');

          const taskId = crypto.randomUUID();
          const db = get().dbsById[dbId];

          const cells = {
            ...Object.fromEntries(
              db.fields.map((f) => [
                f.key,
                f.type === 'number' ? 0 : f.type === 'checkbox' ? false : '',
              ])
            ),
            ...initialCells,
          };

          set((s) => {
            s.nodesById[taskId] = {
              id: taskId,
              type: 'task',
              parentId,
              cells,
              sort: get()._nextSort(parentId),
            };
          });

          return taskId;
        },

        addRootTask() {
          const taskId = crypto.randomUUID();
          set((s) => {
            s.nodesById[taskId] = {
              id: taskId,
              type: 'task',
              parentId: null,
              cells: { name: '' },
              sort: get()._nextSort(null),
            };
          });
          return taskId;
        },

        deleteNode(id) {
          set((s) => {
            delete s.nodesById[id];
          });
        },

        /* ---------- PAGE ---------- */
        addPage(parentId = null) {
          const pageId = crypto.randomUUID();
          set((s) => {
            s.nodesById[pageId] = {
              id: pageId,
              type: 'page',
              parentId,
              cells: { name: '' },
              blocks: [],
              sort: get()._nextSort(parentId),
            };
          });
          return pageId;
        },

        /* ---------- PROFILE ---------- */
        addProfile(name = 'Untitled Profile') {
          const id = crypto.randomUUID();
          set((s) => {
            s.profilesById[id] = { id, name, type: 'profile' };
          });
          return id;
        },
        deleteProfile(id) {
          set((s) => {
            delete s.profilesById[id];
          });
        },

        /* ---------- GENERIC UPDATE ---------- */
        updateNode(id, patch) {
          set((s) => {
            s.nodesById[id] = { ...s.nodesById[id], ...patch };
          });
        },

        /* ---------- MOVE (re-order & re-parent) ---------- */
        moveNode(id, newParentId, newIndex = 0) {
          set((s) => {
            const node = s.nodesById[id];
            if (!node) return;

            const oldParent = node.parentId;
            node.parentId = newParentId;

            // Re-sort siblings of both parents
            const resort = (parent) => {
              Object.values(s.nodesById)
                .filter((n) => n.parentId === parent)
                .sort((a, b) => a.sort - b.sort)
                .forEach((n, i) => (n.sort = i));
            };

            resort(oldParent);
            resort(newParentId);
            node.sort = newIndex;
            resort(newParentId);
          });
        },
      }))
    ),
    {
      name: 'block-planner-store',
      partialize: (s) => ({
        dbsById: s.dbsById,
        nodesById: s.nodesById,
        profilesById: s.profilesById,
      }),
    }
  )
);
