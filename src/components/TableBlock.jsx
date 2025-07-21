import React, { useRef, useEffect, useState } from 'react';

export const TableBlock = ({
  content,
  onChange,
  onKeyDown,
  isFocused,
  onFocus,
  onCommand,
  index,
}) => {
  const [tableData, setTableData] = useState([
    ['', ''],
    ['', ''],
  ]);
  const firstCellRef = useRef(null);

  useEffect(() => {
    if (isFocused && firstCellRef.current) {
      firstCellRef.current.focus();
    }
  }, [isFocused]);

  const handleKeyDown = (e) => {
    if (onKeyDown) onKeyDown(e);
  };

  const handleCellKeyDown = (e, rowIndex, cellIndex) => {
    const totalRows = tableData.length;
    const totalCols = tableData[0].length;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (rowIndex === 1) {
        // From first body row → header
        focusCell(0, cellIndex);
      } else if (rowIndex > 1) {
        // Up within body
        focusCell(rowIndex - 1, cellIndex);
      } else {
        // Already in header — pass up
        onKeyDown?.(e);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (rowIndex === 0 && tableData.length > 1) {
        // Header to first row in same column
        focusCell(1, cellIndex);
      } else if (rowIndex < totalRows - 1) {
        focusCell(rowIndex + 1, cellIndex);
      } else {
        // Last row: pass to global keydown handler
        onKeyDown?.(e);
      }
    }
    if (e.key === 'ArrowLeft') {
      if (cellIndex > 0) {
        e.preventDefault();
        focusCell(rowIndex, cellIndex - 1);
      }
    }
    if (e.key === 'ArrowRight') {
      if (cellIndex < totalCols - 1) {
        e.preventDefault();
        focusCell(rowIndex, cellIndex + 1);
      }
    }
  };
  const focusCell = (row, col) => {
    const cellSelector = `[data-row="${row}"][data-col="${col}"]`;
    const cell = document.querySelector(cellSelector);
    console.log('Selected cell', cell);
    if (cell) {
      setTimeout(() => cell.focus(), 0);
    } else {
      console.warn(`Cell not found for: ${cellSelector}`);
    }
  };
  const handleAddRow = () => {
    setTableData((prev) => {
      const newRow = new Array(prev[0].length).fill('');
      return [...prev, newRow];
    });
  };
  const handleAddColumn = () => {
    setTableData((prev) =>
      prev.map((row, rowIndex) => {
        const newCell = rowIndex === 0 ? '' : '';
        return [...row, newCell];
      })
    );
  };
  const handleCellInput = (e, rowIndex, cellIndex) => {
    const newValue = e.currentTarget.textContent;
    setTableData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = [...updated[rowIndex]];
      updated[rowIndex][cellIndex] = newValue;
      return updated;
    });
  };

  return (
    <div className="mt-2">
      <table className="table-auto border-collapse border border-gray-600">
        <thead>
          <tr>
            {tableData[0].map((header, i) => (
              <th
                key={i}
                data-row={0}
                data-col={i}
                tabIndex={0}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => handleCellInput(e, 0, i)}
                onKeyDown={(e) => handleCellKeyDown(e, 0, i)}
                className="border border-gray-600 p-2"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  data-row={rowIndex + 1}
                  data-col={cellIndex}
                  ref={rowIndex === 0 && cellIndex === 0 ? firstCellRef : null}
                  contentEditable
                  suppressContentEditableWarning
                  className="border border-gray-600 p-2 min-w-[100px] align-top"
                  onInput={(e) => handleCellInput(e, rowIndex + 1, cellIndex)} // 🔁 updated
                  onKeyDown={
                    (e) => handleCellKeyDown(e, rowIndex + 1, cellIndex) // 🔁 updated
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add Row</button>
      <button onClick={handleAddColumn}>Add Column</button>
    </div>
  );
};
