const MAX_MESSAGES_COUNT = Object.freeze({
  // stored could be a 100 and then private stored would be 75? But not many messages would be visible anyways.
  global: Object.freeze({ cached: 25, stored: 75 }),
  private: Object.freeze({ cached: 15, stored: 50 })
});

export default MAX_MESSAGES_COUNT;
