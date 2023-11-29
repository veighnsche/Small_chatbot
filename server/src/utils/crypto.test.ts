import CryptoJS from "crypto-js";
import { encodeMessage } from "./crypto";

describe("encodeMessage", () => {
  const key = "my-32-bit-secret-key123456789012";
  const message = { secret: "This is a secret message" };

  test("should return a string after encoding", () => {
    const encodedMessage = encodeMessage(key, message);
    expect(typeof encodedMessage).toBe("string");
  });

  test("encoded message should be decryptable to the original message", () => {
    const encodedMessage = encodeMessage(key, message);
    const bytes = CryptoJS.AES.decrypt(encodedMessage, key);
    const decryptedMessage = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    expect(decryptedMessage).toEqual(message);
  });

  test("should not encode to the same string if called with the same parameters multiple times (due to initialization vector)", () => {
    const encodedMessage1 = encodeMessage(key, message);
    const encodedMessage2 = encodeMessage(key, message);
    expect(encodedMessage1).not.toEqual(encodedMessage2);
  });

  // TODO: Uncomment this test after implementing validation
  // test('should throw an error when trying to encode a message with an invalid key', () => {
  //   const invalidKey = 'short-key';
  //   expect(() => {
  //     encodeMessage(invalidKey, message);
  //   }).toThrow();
  // });

  test("should produce different output with different keys", () => {
    const key1 = "my-32-bit-secret-key123456789012";
    const key2 = "other-32-bit-secret-key0987654321";
    const encodedMessage1 = encodeMessage(key1, message);
    const encodedMessage2 = encodeMessage(key2, message);
    expect(encodedMessage1).not.toEqual(encodedMessage2);
  });
});