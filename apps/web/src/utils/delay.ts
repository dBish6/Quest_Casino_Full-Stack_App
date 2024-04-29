export default (ms: number, callback?: () => void) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      if (callback) callback();
      resolve();
    }, ms);
  });
