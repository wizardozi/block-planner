// src/utils/commandRegistry.ts
import type { Block } from '../types/block';
import { generateId } from './generateId';

type CommandHandler = (index: number, blocks: Block[]) => Block[];

export const commandRegistry: { [shortcut: string]: CommandHandler } = {
  '#': (index, blocks) => {
    const newBlock: Block = {
      id: generateId(),
      type: 'heading',
      props: { level: 1 },
      content: '',
    };
    const copy = [...blocks];
    copy.splice(index, 1, newBlock);
    return copy;
  },
  '##': (index, blocks) => {
    const newBlock: Block = {
      id: generateId(),
      type: 'heading',
      props: { level: 2 },
      content: '',
    };
    const copy = [...blocks];
    copy.splice(index, 1, newBlock);
    return copy;
  },
  '```': (index, blocks) => {
    const newBlock: Block = {
      id: generateId(),
      type: 'code',
      content: '',
    };
    const copy = [...blocks];
    copy.splice(index, 1, newBlock);
    return copy;
  },
  // Add more commands here...
};
