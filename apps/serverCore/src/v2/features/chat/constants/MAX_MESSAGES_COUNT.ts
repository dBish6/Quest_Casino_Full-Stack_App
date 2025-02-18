const MAX_MESSAGES_COUNT = Object.freeze({
  global: Object.freeze({ cached: 25, stored: 75 }),
  private: Object.freeze({ cached: 15, stored: 50 })
});

export default MAX_MESSAGES_COUNT;
