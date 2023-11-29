import { createEventData } from "./stream";

describe("createEventData", () => {

  test("should generate a correct event data string", () => {
    const type = "USER_LOGIN";
    const data = { userId: "1234", timestamp: "2021-09-01T12:00:00Z" };

    const result = createEventData(type, data);

    expect(result).toBe(JSON.stringify({
      "EVENT_TYPE": type,
      "EVENT_DATA": data,
    }));
  });

  test("encode different types and data correctly", () => {
    const type = "PAGE_VIEW";
    const data = { pageId: "home", duration: 300 };

    const result = createEventData(type, data);

    expect(result).toBe(JSON.stringify({
      "EVENT_TYPE": type,
      "EVENT_DATA": data,
    }));
  });

  test("should handle empty data objects", () => {
    const type = "USER_LOGOUT";
    const data = {};

    const result = createEventData(type, data);

    expect(result).toBe(JSON.stringify({
      "EVENT_TYPE": type,
      "EVENT_DATA": data,
    }));
  });

  test("should throw error if type is empty", () => {
    const type = "";
    const data = { content: "sample" };

    expect(() => {
      createEventData(type, data);
    }).toThrow();
  });

  test("should throw error if type is not a string", () => {
    const type: null = null;
    const data = { content: "sample" };

    expect(() => {
      createEventData(type, data);
    }).toThrow();
  });

});