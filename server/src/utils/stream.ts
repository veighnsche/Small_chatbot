export function createEventData(type: string, data: Record<string, any>) {
  if (!type || typeof type !== "string") {
    console.trace(`type must be a non-empty string, received: ${type}`);
    throw new Error("type must be a non-empty string");
  }

  const eventData = {
    "EVENT_TYPE": type,
    "EVENT_DATA": data,
  };

  return JSON.stringify(eventData);
}