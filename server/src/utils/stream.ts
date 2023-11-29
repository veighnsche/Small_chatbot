export function createEventData(type: string, data: Record<string, any>) {
  if (!type || typeof type !== "string") {
    throw new Error("type must be a non-empty string");
  }

  const eventData = {
    "EVENT_TYPE": type,
    "EVENT_DATA": data,
  };

  return JSON.stringify(eventData);
}