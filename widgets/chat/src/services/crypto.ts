import CryptoJS from "crypto-js";

export function decodeMessage(key: string, message: string) {
  const bytes = CryptoJS.AES.decrypt(message, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  // return {};
}