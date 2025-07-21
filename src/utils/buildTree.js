export const buildTree = (items) => {
  const itemMap = new Map();
  const roots = [];

  for (const item of items) {
    itemMap.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    if (
      !item.parentId ||
      item.parentId === item.id || // self-parenting
      !itemMap.has(item.parentId) // orphaned
    ) {
      roots.push(itemMap.get(item.id));
    } else {
      const parent = itemMap.get(item.parentId);
      parent.children.push(itemMap.get(item.id));
    }
  }

  return roots;
};
