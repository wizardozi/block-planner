import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { HelloWorld } from '../components/TestBlock'; // or wherever your block lives
import { LogBlock } from '../components/LogBlock';

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    helloWorld: HelloWorld,
    log: LogBlock,
  },
});
