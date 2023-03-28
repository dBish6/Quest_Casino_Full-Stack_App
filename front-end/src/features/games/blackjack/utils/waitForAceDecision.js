const waitForAceDecision = (showAcePrompt) => {
  return new Promise((resolve) => {
    const checkAcePrompt = () => {
      if (showAcePrompt === false) {
        resolve();
      } else if (showAcePrompt) {
        // setTimeout(checkAcePrompt, 100);
      }
    };
    checkAcePrompt();
  });
};

export default waitForAceDecision;
