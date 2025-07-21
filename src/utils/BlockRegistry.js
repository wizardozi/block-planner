// utils/blockRegistry.js

export const blockRegistry = {
  text: (id = crypto.randomUUID()) => ({
    id,
    type: 'text',
    content: '',
  }),
  log: (id = crypto.randomUUID()) => ({
    id,
    type: 'log',
    content: '',
    timestamp: new Date().toLocaleString(),
    projectName: 'Prompt Planner App',
    duration: '0.0h',
  }),
};
