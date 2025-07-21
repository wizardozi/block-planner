import React, { useState, useRef, useEffect } from 'react';
import { usePageManager } from '../context/PageContext';
import BlockEditor from './BlockEditor';
import { useDebouncedCallback } from 'use-debounce';

export const PageBlock = ({ pageData }) => {
  const { updatePage, getPageById, addPage } = usePageManager();

  const getDefaultBlock = () => ({
    id: crypto.randomUUID(),
    type: 'paragraph',
    props: {},
    content: [
      {
        type: 'text',
        text: '',
        styles: {},
      },
    ],
    children: [],
  });

  const [page, setPage] = useState(() => {
    if (!pageData) return null;
    return {
      ...pageData,
      blocks: pageData.blocks?.length ? pageData.blocks : [getDefaultBlock()],
    };
  });

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [page.name]);

  const handleChange = (key, value) => {
    setPage((prev) => ({ ...prev, [key]: value }));
  };

  const debouncedUpdate = useDebouncedCallback((updatedPage) => {
    updatePage(updatedPage);
  }, 300);

  useEffect(() => {
    debouncedUpdate(page);
  }, [page, debouncedUpdate]);

  return (
    <div className="ml-4 p-4">
      {/* Page Header */}
      <textarea
        ref={textareaRef}
        className="text-5xl font-bold outline-none w-full resize-none overflow-hidden leading-tight pl-13.5"
        value={page.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="New Page"
      />

      <div className="flex-grow">
        <BlockEditor
          blocks={page.blocks}
          onChange={(newBlocks) =>
            setPage((prev) => ({ ...prev, blocks: newBlocks }))
          }
        />
      </div>
    </div>
  );
};

export default PageBlock;
