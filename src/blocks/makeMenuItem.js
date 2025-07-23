// src/blocks/makeMenuItem.js
import { insertOrUpdateBlock } from '@blocknote/core';

export const makeMenuItem = (editor, cfg) => ({
  title: cfg.title,
  group: cfg.group,
  aliases: cfg.aliases,
  icon: cfg.icon,
  onItemClick: () => insertOrUpdateBlock(editor, { type: cfg.type }),
});
