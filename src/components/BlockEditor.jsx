import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useEffect } from 'react';

export const BlockEditor = ({ blocks, onChange }) => {
  const editor = useCreateBlockNote({ initialContent: blocks });

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange((editor, { getChanges }) => {
      const changes = getChanges();

      if (onChange) onChange(editor.document);
    });

    return () => unsubscribe();
  }, [editor, onChange]);

  return <BlockNoteView editor={editor} />;
};

export default BlockEditor;
