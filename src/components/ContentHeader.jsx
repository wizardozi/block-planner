// src/components/ContentHeader.jsx
import { useParams } from 'react-router-dom';
import { useStore } from '../state/store';
import { useMemo } from 'react';

export default function ContentHeader() {
  /* ----- 1. figure out the current node id from route params ----- */
  const { id, projectId, taskId, profileId, pageId } = useParams();
  const currentId = id || projectId || taskId || profileId || pageId;

  /* ----- 2. read the whole node map from zustand ----- */
  const nodesById = useStore((s) => s.nodesById);

  /* ----- 3. compute breadcrumbs once whenever graph or id changes ----- */
  const breadcrumbs = useMemo(() => {
    const trail = [];
    let node = nodesById[currentId];

    while (node) {
      // show title, or name, or fallback
      const label = node.title || node.name || node.cells?.name || 'Untitled';

      trail.unshift({ id: node.id, label });
      if (!node.parentId) break; // reached root
      node = nodesById[node.parentId];
    }
    return trail;
  }, [nodesById, currentId]);

  /* ----- 4. render ----- */
  return (
    <div className="pb-2 text-sm min-h-8">
      {breadcrumbs.length === 0 ? (
        <span>No breadcrumbs</span>
      ) : (
        breadcrumbs.map((crumb, i) => (
          <span key={crumb.id}>
            {i > 0 && ' / '}
            {crumb.label}
          </span>
        ))
      )}
    </div>
  );
}
