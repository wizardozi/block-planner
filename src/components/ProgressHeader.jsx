// src/components/ProgressHeader.jsx
import React from 'react';

export const ProgressHeader = ({ mode = 'Logs', onChange }) => {
  const views = ['Logs', 'Charts'];

  return (
    <div className="relative">
      <div className="text-4xl font-bold">{mode}</div>

      <select
        value={mode}
        onChange={(e) => onChange?.(e.target.value)}
        className="absolute right-5 top-3 outline-none"
      >
        {views.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};
