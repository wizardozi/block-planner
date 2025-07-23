import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { HelloWorld } from '../components/TestBlock'; // or wherever your block lives

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    helloWorld: HelloWorld,
  },
});
