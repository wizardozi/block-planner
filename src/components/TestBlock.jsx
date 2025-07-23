// src/components/TestBlock.jsx
import { createReactBlockSpec } from '@blocknote/react';
export const HelloWorld = createReactBlockSpec(
  {
    type: 'helloWorld',
    propSchema: {},
    content: 'none',
    isSelectable: false,
  },
  {
    render: () => <div>Hello World</div>,
  }
);
