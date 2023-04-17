const waitForAceDecision = (showAcePrompt) => {
  return new Promise((resolve, reject) => {
    const checkAcePrompt = () => {
      if (showAcePrompt === false) {
        resolve();
      } else if (showAcePrompt) {
        return;
      }
    };
    checkAcePrompt();
  });
};

export default waitForAceDecision;
