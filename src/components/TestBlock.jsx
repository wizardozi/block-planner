import React, { useRef, useState, useEffect } from 'react';
import '../styles/TextBlock.css';

export const TestBlock = ({
  content,
  onChange,
  onKeyDown,
  isFocused,
  onFocus,
  onCommand,
  index,
}) => {
  const divRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(content.trim() === '');
  const [tag, setTag] = useState('p');
  const [text, setText] = useState(content || '');
  const [localText, setLocalText] = useState(content || '');

  // Focus editable div when isFocused is passed down
  useEffect(() => {
    if (isFocused && divRef.current) {
      divRef.current.innerText = localText; // rehydrate content
      divRef.current.focus();

      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(divRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [isFocused, localText]);

  useEffect(() => {
    console.log('isFocused changed:', isFocused);
  }, [isFocused]);

  useEffect(() => {
    setLocalText(content);
  }, [content]); // optional: only if parent updates content from outside
  // Keep internal state in sync with external content
  useEffect(() => {
    const el = divRef.current;
    if (!el) return;

    const isActive = document.activeElement === el;
    if (!isActive && el.innerText !== content) {
      el.innerText = content;
    }

    setIsEmpty(content.trim() === '');
    setTag(getTagFromText(content));
    setText(content); // update preview display text
  }, [content]);

  const getTagFromText = (text) => {
    if (/^#{3}( |$)/.test(text)) return 'h3';
    if (/^#{2}( |$)/.test(text)) return 'h2';
    if (/^#{1}( |$)/.test(text)) return 'h1';
    return 'p';
  };

  const stripMarkdown = (text) => text.replace(/^#{1,3}\s*/, '');

  const handleInput = (e) => {
    const newText = e.target.innerText;
    setTag(getTagFromText(newText));
    setText(newText);
    onChange?.(newText);
  };

  const handleKeyDown = (e) => {
    onKeyDown?.(e);
  };

  return (
    <div className="text-block-container">
      {isFocused ? (
        <div
          ref={divRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={onFocus}
          onInput={(e) => {
            const newText = e.target.innerText;
            setTag(getTagFromText(newText));
            setLocalText(newText); // just update local
            onChange?.(newText); // also bubble up if needed
          }}
          onKeyDown={handleKeyDown}
          className={`text-block ${tag}`}
          spellCheck={false}
        />
      ) : (
        <div className={`text-block ${tag} preview`} onClick={onFocus}>
          {stripMarkdown(localText)}
        </div>
      )}
    </div>
  );
};
