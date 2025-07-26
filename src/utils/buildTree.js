export const buildTree = (items) => {
  const nodeMap = new Map();
  const roots = [];

  // 1 — materialise every node once
  for (const it of items) {
    nodeMap.set(it.id, { ...it, children: [] });
  }

  // 2 — link children → parent
  for (const it of items) {
    const wrapped = nodeMap.get(it.id);

    // root if no parent, self-parent, or orphan
    if (!it.parentId || it.parentId === it.id || !nodeMap.has(it.parentId)) {
      roots.push(wrapped);
    } else {
      nodeMap.get(it.parentId).children.push(wrapped);
    }
  }

  // 3 — depth-first sort by .sort on every sibling list
  const sortBranch = (branch) => {
    branch.children
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
      .forEach(sortBranch); // recurse
  };

  roots
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) // root-level order too
    .forEach(sortBranch);

  return roots;
};
