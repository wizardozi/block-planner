// src/models/db.js
//--------------------------------------------------
//  Database object: one per scope (project/page/…)
//--------------------------------------------------
export function createDB(id) {
  return { id, fields: [] }; // schema only; rows live elsewhere
}

//----------------------------------------------
//  Add a new field and seed it in every row
//----------------------------------------------
export function addField(db, field, mutateRows) {
  db.fields.push(field); // add to schema

  mutateRows((row) => {
    // callback supplied by caller
    row.cells[field.key] = getDefault(field.type);
  });
}

//----------------------------------------------
//  Rename a field key everywhere
//----------------------------------------------
export function renameField(db, oldKey, newKey, mutateRows) {
  const f = db.fields.find((x) => x.key === oldKey);
  if (f) f.key = newKey;

  mutateRows((row) => {
    row.cells[newKey] = row.cells[oldKey];
    delete row.cells[oldKey];
  });
}

//----------------------------------------------
//  Delete a field from schema + all rows
//----------------------------------------------
export function deleteField(db, key, mutateRows) {
  db.fields = db.fields.filter((f) => f.key !== key);

  mutateRows((row) => {
    delete row.cells[key];
  });
}

//----------------------------------------------
function getDefault(type) {
  if (type === 'number') return 0;
  if (type === 'multi') return [];
  return '';
}
