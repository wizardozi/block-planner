// utils/handleSlashCommand.js
const isBlockReplacementCommand = (query) => {
  return query === 'log' || 'table'; // Add more replacement blocks here
};

export const handleSlashCommand = ({ query, currentBlockIndex, blocks }) => {
  if (!isBlockReplacementCommand(query)) {
    // Headings and similar inline styles are handled inside TextBlock now
    return blocks;
  }

  const newBlock = {
    id: crypto.randomUUID(),
    type: query, // e.g. 'log'
    content: '',
  };

  const newTextBlock = {
    id: crypto.randomUUID(),
    type: 'text',
    content: '',
  };

  return [
    ...blocks.slice(0, currentBlockIndex),
    newBlock,
    newTextBlock,
    ...blocks.slice(currentBlockIndex + 1),
  ];
};
