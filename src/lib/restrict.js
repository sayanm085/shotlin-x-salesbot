// 📁 src/lib/restrict.js
const restrictedNumbers = new Set();

export const restrictNumber = (phone) => restrictedNumbers.add(phone);
export const unrestrictNumber = (phone) => restrictedNumbers.delete(phone);
export const isRestricted = (phone) => restrictedNumbers.has(phone);
