import React, { useState, useEffect } from 'react';
import { TestBlock } from './TestBlock';
import { TextBlock } from './TextBlock';
import { LogBlock } from './LogBlock';
import { TableBlock } from './TableBlock';
import { handleSlashCommand } from '../utils/handleSlashCommand';

export const PageBody = ({ blocks, onChange }) => {
  const [focusedBlockId, setFocusedBlockId] = useState(blocks[0].id);
  const [slashActive, setSlashActive] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');

  const updateBlock = (id, newContent) => {
    const updated = blocks.map((b) =>
      b.id === id ? { ...b, content: newContent } : b
    );
    onChange(updated);
  };

  const handleKeyDown = (e, id) => {
    const index = blocks.findIndex((b) => b.id === id);
    const currentBlock = blocks[index];

    if (e.key === 'Enter') {
      e.preventDefault();

      if (slashActive) {
        const updated = handleSlashCommand({
          query: slashQuery,
          currentBlockIndex: index,
          blocks,
        });

        onChange(updated);
        setFocusedBlockId(updated[index + 1]?.id || null);
        setSlashActive(false);
        setSlashQuery('');
      } else {
        const newBlock = {
          id: crypto.randomUUID(),
          type: 'text',
          content: '',
        };

        const updated = [
          ...blocks.slice(0, index + 1),
          newBlock,
          ...blocks.slice(index + 1),
        ];

        onChange(updated);
        setFocusedBlockId(newBlock.id);
      }
    } else if (e.key === '/') {
      setSlashActive(true);
      setSlashQuery('');
    } else if (slashActive && e.key.length === 1 && e.key !== 'Enter') {
      setSlashQuery((prev) => prev + e.key);
    } else if (e.key === 'Escape') {
      setSlashActive(false);
      setSlashQuery('');
    } else if (e.key === 'Backspace') {
      const isOnlyBlock = blocks.length === 1;
      const isEmpty = currentBlock?.content.trim() === '';

      if (!isOnlyBlock && isEmpty) {
        const updated = blocks.filter((_, i) => i !== index);
        onChange(updated);
        setFocusedBlockId(blocks[Math.max(index - 1, 0)]?.id || null);
      }
    } else if (e.key === 'ArrowUp' && index > 0) {
      setFocusedBlockId(blocks[index - 1].id);
    } else if (e.key === 'ArrowDown' && index < blocks.length - 1) {
      setFocusedBlockId(blocks[index + 1].id);
    }
  };

  return (
    <div>
      {blocks.map((block, i) => {
        const isFocused = block.id === focusedBlockId;
        const sharedProps = {
          content: block.content,
          onChange: (val) => updateBlock(block.id, val),
          onKeyDown: (e) => handleKeyDown(e, block.id),
          isFocused,
          onFocus: () => setFocusedBlockId(block.id),
          index: i,
        };
        return (
          <div key={block.id} className="group relative">
            <button
              onClick={() => {
                const updated = blocks.filter((_, j) => j !== i);
                onChange(updated);
              }}
              style={{
                position: 'absolute',
                left: '-24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
                outline: 'none',
                boxShadow: 'none',
                cursor: 'pointer',
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
            >
              ✖
            </button>

            {/* Instead of ml-5, use pl-6 or pl-8 to make space for the button */}
            <div className=" hover:bg-gray-50  dark:text-neutral-50 dark:hover:bg-neutral-800">
              {block.type === 'log' && <LogBlock {...sharedProps} />}
              {block.type === 'table' && <TableBlock {...sharedProps} />}
              {block.type === 'text' && <TextBlock {...sharedProps} />}
            </div>
          </div>
        );
      })}
      {slashActive && (
        <div className="slash-menu">
          <p>Type: {slashQuery}</p>
        </div>
      )}
    </div>
  );
};
