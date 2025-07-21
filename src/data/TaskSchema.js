// TaskSchema.js

export const TaskSchema = [
  {
    key: 'name',
    name: 'Name',
    type: 'text',
    required: true,
  },
  {
    key: 'due',
    name: 'Due Date',
    type: 'datetime',
    options: {
      includeTime: true,
      allowRange: true,
    },
  },
  {
    key: 'status',
    name: 'Status',
    type: 'select',
    options: ['Not Started', 'In Progress', 'Done'],
  },
  {
    key: 'priority',
    name: 'Priority',
    type: 'select',
    options: ['Low', 'Medium', 'High'],
  },
  {
    key: 'tags',
    name: 'Tags',
    type: 'multi-select',
    options: ['UI', 'Backend', 'Feature', 'Urgent'],
  },
  {
    key: 'hours',
    name: 'Estimated Hours',
    type: 'number',
  },
];
