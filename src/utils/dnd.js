export function parseDragId(id) {
  if (id === 'dropzone-none') {
    return { context: 'sidebar', type: 'dropzone', id: null };
  }

  const [context, type, ...rest] = id.split('-');

  const rawId = rest.join('-');

  if (!type) {
    return { context, type: 'column', id: id.replace(`${context}-`, '') };
  }

  return { context, type, id: rawId };
}
