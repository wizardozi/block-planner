// utils/editorStore.js
//--------------------------------------------
//  ONE KEY FOR ANY CONTEXT + ID
//--------------------------------------------
export const keyFor = (context, id) => `${context}-editor-${id}`;

/**
 * @param {string} context  e.g. "task" | "page"
 * @param {string} id       UUID or slug
 * @param {object} docProxy The BlockNote document proxy
 */
export function saveDoc(context, id, docProxy) {
  localStorage.setItem(keyFor(context, id), JSON.stringify(docProxy));
}

/**
 * Load the previously-saved document (may be undefined the first time).
 * @returns {object|undefined}
 */
export function loadDoc(context, id) {
  const txt = localStorage.getItem(keyFor(context, id));
  return txt ? JSON.parse(txt) : undefined;
}
