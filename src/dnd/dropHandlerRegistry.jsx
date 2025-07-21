// dropHandlerRegistry.js

const dropHandlers = new Map();

export function registerDropHandler(targetType, handlerFn) {
  dropHandlers.set(targetType, handlerFn);
}

export function getDropHandler(targetType) {
  return dropHandlers.get(targetType);
}
