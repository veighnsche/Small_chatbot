import { EventBus } from "./eventBus";

describe('EventBus', () => {
  let eventBus: EventBus<{ testEvent: typeof testData }>;
  const testEvent = 'testEvent';
  const testData = { key: 'value' };
  const mockCallback = jest.fn();

  beforeEach(() => {
    eventBus = new EventBus();
    mockCallback.mockClear();
  });

  test('on should register an event with a callback', () => {
    eventBus.on(testEvent, mockCallback);
    eventBus.emit(testEvent, testData);
    expect(mockCallback).toHaveBeenCalledWith(testData);
  });

  test('off should remove a registered event callback', () => {
    eventBus.on(testEvent, mockCallback);
    eventBus.off(testEvent, mockCallback);
    eventBus.emit(testEvent, testData);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('once should register an event that is called only once', () => {
    eventBus.once(testEvent, mockCallback);
    eventBus.emit(testEvent, testData);
    eventBus.emit(testEvent, testData);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('offAll should remove all callbacks for an event', () => {
    eventBus.on(testEvent, mockCallback);
    eventBus.on(testEvent, () => {});
    eventBus.offAll(testEvent);
    eventBus.emit(testEvent, testData);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('emitAsync should call all async callbacks and handle errors', async () => {
    const asyncCallback = jest.fn().mockResolvedValueOnce('resolved');
    const errorCallback = jest.fn().mockRejectedValueOnce(new Error('rejected'));

    eventBus.on(testEvent, asyncCallback);
    eventBus.on(testEvent, errorCallback);

    await eventBus.emitAsync(testEvent, testData);

    expect(asyncCallback).toHaveBeenCalledWith(testData);
    expect(errorCallback).toHaveBeenCalledWith(testData);
    // Optionally, you can check for console errors if needed
  });

  test('emitCollect should collect responses from all callbacks', () => {
    const responseCallback = jest.fn(data => `Response: ${data.key}`);
    eventBus.on(testEvent, responseCallback);
    eventBus.on(testEvent, mockCallback);

    const responses = eventBus.emitCollect(testEvent, testData);

    expect(responses).toContain(`Response: ${testData.key}`);
    expect(mockCallback).toHaveBeenCalledWith(testData);
  });

  // Additional tests can be added to cover more complex scenarios or error handling
});
