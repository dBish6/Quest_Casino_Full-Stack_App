import type ChatMessage from "@chatFeat/typings/ChatMessage";

/**
 * A `Circular Queue` or `Circular Buffer` for efficient insert and removal of `chat messages`.
 */
export default class CircularQueue {
  public messages: ChatMessage[];
  private capacity: number;
  private head: number;
  private tail: number;
  public size: number;

  constructor(initialMessages: ChatMessage[] = [], capacity: number = 70) {
    if (initialMessages.length > capacity) 
      throw new Error(`CircularQueue error:\nInitial messages exceed the capacity of ${capacity}.`);
    
    this.messages = Array.from({ length: capacity });
    this.capacity = capacity;
    this.head = 0;
    this.tail = initialMessages.length % this.capacity;
    this.size = initialMessages.length;

    for (let i = 0; i < initialMessages.length; i++) {
      this.messages[(this.head + i) % capacity] = initialMessages[initialMessages.length - 1 - i];
    }
  }

  public enqueue(val: ChatMessage) {
    this.messages[this.tail] = val;
    this.tail = (this.tail + 1) % this.capacity;
    if (this.size === this.capacity) this.head = (this.head + 1) % this.capacity; // Overwrites oldest data.
    else this.size++;
  }

  public dequeue() {
    if (this.size === 0) return undefined;

    const value = this.messages[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.size--;

    return value;
  }

  public peek() {
    if (this.size === 0) return undefined;
    return this.messages[(this.tail - 1 + this.capacity) % this.capacity];
  }

  public *values(): IterableIterator<ChatMessage> {
    for (let i = 0; i < this.size; i++) {
      yield this.messages[(this.head + i) % this.capacity];
    }
  }
}
