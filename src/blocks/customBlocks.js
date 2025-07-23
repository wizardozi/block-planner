// src/blocks/customBlocks.js
import { MdInfo, MdOutlineTableChart } from 'react-icons/md';
import React from 'react';
/**
 * Each block entry:
 *  type        → matches the BlockNote spec’s `type`
 *  title       → label for slash menu
 *  group       → same group you want in the menu
 *  icon        → React node (optional)
 *  aliases     → extra slash keywords
 *  toolbar     → true ⇢ show in FormattingToolbar; false ⇢ slash-menu only
 */
export const CUSTOM_BLOCKS = [
  {
    type: 'helloWorld',
    title: 'Hello World',
    group: 'Basic blocks',
    icon: '👋',
    aliases: ['hello', 'world'],
    toolbar: true,
  },
  {
    type: 'logBlock',
    title: 'Log entry',
    group: 'Basic blocks',
    icon: () => React.createElement(MdInfo),
    aliases: ['log', 'entry', 'journal'],
    toolbar: true,
  },
  {
    type: 'promptLog',
    title: 'Prompt logger',
    group: 'Basic blocks',
    icon: () => React.createElement(MdOutlineTableChart),
    aliases: ['prompt', 'prompts'],
    toolbar: false,
  },
  // add more here ⇣
];
