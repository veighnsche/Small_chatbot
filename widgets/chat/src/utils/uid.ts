export const generateUniqueID = () => {
  // current timestamp in milliseconds + dot + 4 random digits
  return Date.now() + '.' + Math.floor(Math.random() * 10000);
}