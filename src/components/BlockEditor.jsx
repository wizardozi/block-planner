// src/components/BlockEditor.jsx
import { useMemo, useState, useEffect } from 'react';
import {
  BlockNoteEditor,
  insertOrUpdateBlock,
  filterSuggestionItems,
} from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import {
  useCreateBlockNote,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  blockTypeSelectItems,
} from '@blocknote/react';
import { schema } from '../editor/editorSchema';
import { saveDoc, loadDoc } from '../utils/editorStore';

import { CUSTOM_BLOCKS } from '../blocks/customBlocks';
import { makeMenuItem } from '../blocks/makeMenuItem';

function BlockEditor({ context, docId }) {
  const [initial, setInitial] = useState('loading');

  /* 1 ▸ load once */
  useEffect(() => {
    setInitial(loadDoc(context, docId) ?? undefined);
  }, [context, docId]);

  /* 2 ▸ create editor after content is ready */
  const editor = useMemo(() => {
    if (initial === 'loading') return undefined;
    return BlockNoteEditor.create({ schema, initialContent: initial });
  }, [initial, context, docId]);

  if (!editor) return <div style={{ padding: 16 }}>Loading editor…</div>;

  return (
    <BlockNoteView
      editor={editor}
      formattingToolbar={false}
      slashMenu={false}
      onChange={() => saveDoc(context, docId, editor.document)}
    >
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar
            blockTypeSelectItems={[
              ...blockTypeSelectItems(editor.dictionary),
              // ...blockTypeSelectItems(editor.dictionary),
              // ...CUSTOM_BLOCKS.filter((c) => c.toolbar).map((c) => ({
              //   name: c.title,
              //   type: c.type,
              //   isSelected: (b) => b.type === c.type,
            ]}
          />
        )}
      />

      {/* slash menu */}
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) => {
          // 1️⃣ start with BlockNote’s defaults
          const items = getDefaultReactSlashMenuItems(editor);

          // 2️⃣ add every custom block
          CUSTOM_BLOCKS.forEach((cfg) => {
            const idx = items.findLastIndex((i) => i.group === cfg.group);
            items.splice(idx + 1, 0, makeMenuItem(editor, cfg));
          });

          return filterSuggestionItems(items, query);
        }}
      />
    </BlockNoteView>
  );
}

export default BlockEditor;
