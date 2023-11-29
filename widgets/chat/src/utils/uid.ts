import { v4 as uuid } from 'uuid';

export const generateUnique_id = () => {
  // current timestamp in milliseconds + dot + 4 random digits
  return uuid();
}