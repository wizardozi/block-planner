import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

/**
 * One row in the sidebar tree.
 * • Draggable and droppable share the SAME id ("sidebar-<id>").
 * • All drag metadata lives in `data` (nodeId + type).
 */
export const SidebarItem = ({
  item,
  depth = 0,
  expandedMap,
  toggleExpanded,
  getItemKey,
  onContextMenu,
}) => {
  /* ---------- id & data ---------- */
  const id = `sidebar-${item.id}`; // unique in global tree
  const data = { nodeId: item.id, type: item.type };

  /* ---------- dnd-kit ---------- */
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({ id, data });

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id, data });

  /* merge refs */
  const setRefs = (el) => {
    setDragRef(el);
    setDropRef(el);
  };

  /* ---------- UI helpers ---------- */
  const nav = useNavigate();
  const isExpanded = expandedMap[getItemKey(item)];
  const indentPx = depth * 16;

  const open = () => {
    if (item.type === 'project') nav(`/project/${item.id}`);
    if (item.type === 'task') nav(`/task/${item.id}`);
    if (item.type === 'page') nav(`/page/${item.id}`);
  };

  /* ---------- styles ---------- */
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    background: isOver ? '#eef' : undefined,
    paddingLeft: indentPx,
  };

  const title = item.fields?.name || item.name || (
    <em>{`Untitled ${
      item.type.charAt(0).toUpperCase() + item.type.slice(1)
    }`}</em>
  );

  /* ---------- render ---------- */
  return (
    <div className="relative">
      <div
        ref={setRefs}
        {...attributes}
        {...listeners}
        style={style}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu?.(e, item);
        }}
        className="group flex items-center text-sm select-none cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
      >
        {/* indent lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: depth }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-zinc-300"
              style={{ left: `${i * 16 + 7}px` }}
            />
          ))}
        </div>

        {/* chevron */}
        {item.children?.length ? (
          <span
            className="w-4 mr-1 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(getItemKey(item));
            }}
          >
            <svg
              className={`w-3 h-3 text-zinc-500 transition-transform duration-150 ${
                isExpanded ? 'rotate-90' : ''
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        ) : (
          <span className="w-4 mr-1" />
        )}

        <span onClick={open} className="truncate flex-1">
          {title}
        </span>
      </div>

      {/* children */}
      {isExpanded &&
        item.children?.map((c) => (
          <SidebarItem
            key={getItemKey(c)}
            item={c}
            depth={depth + 1}
            expandedMap={expandedMap}
            toggleExpanded={toggleExpanded}
            getItemKey={getItemKey}
            onContextMenu={onContextMenu}
          />
        ))}
    </div>
  );
};
