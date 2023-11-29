type EventMap = Record<string, any>;

type EventCallback<T> = (data: T) => void;

export class EventBus<T extends EventMap> {
  private listeners: Map<keyof T, Set<EventCallback<any>>> = new Map();

  on<K extends keyof T>(event: K, callback: EventCallback<T[K]>): () => void {
    const listeners = this.listeners.get(event) || new Set<EventCallback<any>>();
    listeners.add(callback as EventCallback<any>);
    this.listeners.set(event, listeners);
    return () => this.off(event, callback);
  }

  off<K extends keyof T>(event: K, callback: EventCallback<T[K]>): void {
    this.listeners.get(event)?.delete(callback as EventCallback<any>);
  }

  emit<K extends keyof T>(event: K, data?: T[K]): void {
    this.listeners.get(event)?.forEach((callback: EventCallback<any>) => {
      try {
        callback(data);
      } catch (error) {
        console.trace(`Error occurred in callback for event: ${String(event)}`, error);
      }
    });
  }

  once<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    const onceCallback = (data: T[K]) => {
      this.off(event, onceCallback);
      callback(data);
    };
    this.on(event, onceCallback);
  }

  offAll<K extends keyof T>(event: K): void {
    this.listeners.delete(event);
  }

  async emitAsync<K extends keyof T>(event: K, data: T[K]): Promise<void> {
    for (const callback of this.listeners.get(event) || []) {
      try {
        await callback(data);
      } catch (error) {
        console.trace(`Error occurred in async callback for event: ${String(event)}`, error);
      }
    }
  }

  emitCollect<K extends keyof T>(event: K, data: T[K]): Array<unknown> {
    const responses: Array<unknown> = [];
    this.listeners.get(event)?.forEach(callback => {
      try {
        responses.push(callback(data));
      } catch (error) {
        console.trace(`Error occurred in callback for event: ${String(event)}`, error);
      }
    });
    return responses;
  }
}

export const connectionsEventBus = new EventBus<EventMap>();