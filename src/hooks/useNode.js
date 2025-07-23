import { useStore } from '../state/store';
import { useMemo } from 'react';

export const useNode = (id) => {
  const node = useStore((s) => s.nodesById[id]);
  const dbs = useStore((s) => s.dbsById);

  // resolve nearest database
  const db = useMemo(() => {
    let cur = node;
    while (cur) {
      if (cur.database) return dbs[cur.database];
      cur = useStore.getState().nodesById[cur.parentId];
    }
    return null;
  }, [node, dbs]);

  // immediate children (rows)
  const children = useMemo(() => {
    const all = useStore.getState().nodesById;
    return Object.values(all).filter((n) => n.parentId === id);
  }, [id]);

  return { node, db, children };
};
