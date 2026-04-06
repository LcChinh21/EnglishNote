// Get week number from date
export const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Get start and end dates of a week
export const getWeekDates = (week, year) => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

  const startDate = new Date(ISOweekStart);
  const endDate = new Date(ISOweekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

  return { startDate, endDate };
};

// Get first and last day of month
export const getMonthDates = (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return { startDate, endDate };
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format date for input
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current week
export const getCurrentWeek = () => {
  return getWeekNumber(new Date());
};

// Get current month
export const getCurrentMonth = () => {
  return new Date().getMonth() + 1;
};

// Get current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Get week label
export const getWeekLabel = (week, year) => {
  return `Week ${week}, ${year}`;
};

// Get month label
export const getMonthLabel = (month, year) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthNames[month - 1]} ${year}`;
};
