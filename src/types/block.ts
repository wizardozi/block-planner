export type BaseBlock = {
  id: string;
  content: string;
};

export type TextBlock = BaseBlock & {
  type: 'text';
};

export type LogBlock = BaseBlock & {
  type: 'log';
  timestamp?: string;
  projectName?: string;
  duration?: string;
};

export type Heading1Block = BaseBlock & { type: 'heading1' };
export type Heading2Block = BaseBlock & { type: 'heading2' };
export type Heading3Block = BaseBlock & { type: 'heading3' };

export type Block =
  | TextBlock
  | LogBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block;
