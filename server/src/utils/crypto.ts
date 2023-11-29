import CryptoJS from "crypto-js";

export function encodeMessage(key: string, message: Record<string, any>) {
  return CryptoJS.AES.encrypt(JSON.stringify(message), key).toString();
}
