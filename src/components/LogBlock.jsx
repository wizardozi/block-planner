import React, { useRef, useEffect, useState } from 'react';
import { createReactBlockSpec } from '@blocknote/react';

export const LogBlock = createReactBlockSpec(
  {
    type: 'log',
    propSchema: {},
    content: 'none',
    isSelectable: false,
  },
  {
    render: () => <div>LogBlock</div>,
  }
);
