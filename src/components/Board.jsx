import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../state/store';
import { shallow } from 'zustand/shallow';

import BoardColumn from './BoardColumn';

export default function Board() {
  const { projectId } = useParams();

  /* stable slices */
  const nodesById = useStore((s) => s.nodesById, shallow);
  const dbsById = useStore((s) => s.dbsById, shallow);

  /* status columns for this project */
  const statusOptions = useMemo(() => {
    const proj = nodesById[projectId];
    if (!proj) return [];

    const db = dbsById[proj.database];
    return db?.fields?.find((f) => f.key === 'status')?.options || [];
  }, [nodesById, dbsById, projectId]);

  /* empty-state banner */
  const tasksInProject = useMemo(
    () =>
      Object.values(nodesById).filter(
        (n) => n.type === 'task' && n.parentId === projectId
      ),
    [nodesById, projectId]
  );

  return (
    <div className="flex gap-2 overflow-x-auto">
      {statusOptions.map((status) => (
        <BoardColumn key={status} status={status} />
      ))}

      {tasksInProject.length === 0 && (
        <div className="text-sm text-gray-500 p-4">
          No tasks yet. Click “+” in any column to add one.
        </div>
      )}
    </div>
  );
}
