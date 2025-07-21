// src/utils/dateUtils.js
export function getDateRange(viewMode, activeDate) {
  if (viewMode !== 'month') return [];

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay(); // 0 = Sunday

  // Start date of grid: back up to the previous Sunday (may be in previous month)
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startDay);

  const days = [];

  // Fill 6 weeks (6 * 7 = 42 days)
  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + i);
    days.push(day);
  }

  return days;
}
