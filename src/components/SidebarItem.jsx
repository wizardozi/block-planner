import { useNavigate } from 'react-router-dom';
import { useDraggable, useDroppable } from '@dnd-kit/core';

export const SidebarItem = ({
  item,
  depth = 0,
  expandedMap,
  toggleExpanded,
  getItemKey,
  onItemDrop,
  onContextMenu,
}) => {
  const id = `sidebar-${item.type}-${item.id}`;
  // console.log('SidebarItem props:', item);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({ id });

  const navigate = useNavigate();
  const isExpanded = expandedMap[getItemKey(item)];

  const handleClick = () => {
    try {
      if (item.type === 'project') {
        navigate(`/project/${item.id}`);
      } else if (item.type === 'task') {
        navigate(`/task/${item.id}`);
      } else if (item.type === 'page') {
        navigate(`/page/${item.id}`);
      }
    } catch (err) {
      console.error('Sidebar click crash:', err);
    }
  };
  const getTitle = (item) =>
    item.fields?.name || item.name || handleUntitled(item.type);

  const handleUntitled = (type) => {
    if (type === 'profile') return <em>Untitled Profile</em>;
    if (type === 'project') return <em>Untitled Project</em>;
    if (type === 'task') return <em>Untitled Task</em>;
    if (type === 'page') return <em>Untitled Page</em>;
  };

  // Apply transform from dnd-kit if dragging
  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    paddingLeft: depth * 16,
    border: isOver ? '1px solid' : undefined,
    borderRadius: isOver ? 4 : undefined,
  };

  return (
    <div className="relative">
      {/* Item row container */}
      <div
        ref={(el) => {
          setDraggableRef(el);
          setDroppableRef(el);
        }}
        {...attributes}
        {...listeners}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu?.(e, item);
        }}
        style={style}
        className="relative group flex items-center text-sm   hover:bg-gray-100 dark:hover:bg-neutral-700 py-0.5 select-none"
      >
        {/* Vertical indent lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: depth }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-zinc-300"
              style={{ left: `${i * 16 + 7}px` }}
            />
          ))}
        </div>

        {/* Chevron */}
        <span
          className="mr-1 w-4 flex items-center justify-center"
          onClick={(e) => {
            if (item.children?.length > 0) {
              e.stopPropagation();
              toggleExpanded?.(getItemKey(item));
            }
          }}
        >
          {item.children?.length > 0 && (
            <svg
              className={`w-3 h-3 text-zinc-500 transition-transform duration-150 ${
                isExpanded ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </span>

        {/* Title */}
        <span
          onClick={handleClick}
          className="truncate cursor-pointer min-w-0 flex-1"
        >
          {getTitle(item)}
        </span>
      </div>

      {/* Children */}
      {isExpanded &&
        item.children?.length > 0 &&
        item.children.map((child) => (
          <SidebarItem
            key={getItemKey(child)}
            item={child}
            depth={depth + 1}
            expandedMap={expandedMap}
            toggleExpanded={toggleExpanded}
            getItemKey={getItemKey}
            onContextMenu={onContextMenu}
            onItemDrop={onItemDrop}
          />
        ))}
    </div>
  );
};
