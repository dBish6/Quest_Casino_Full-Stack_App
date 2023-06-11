const useKeyboardHelper = () => {
  const handleKeyDown = (event, options) => {
    if (event.key === "Enter" || event.key === " ") {
      if (options) {
        if (options.navigate && options.location) {
          options.navigate(options.location);
        } else if (options.toggleVisibility && options.type) {
          options.objKey
            ? options.toggleVisibility((prev) => ({
                ...prev,
                [options.objKey]: options.type === "off" ? false : true,
              }))
            : options.toggleVisibility(options.type === "off" ? false : true);
        } else if (options.setShow) {
          options.objKey
            ? options.setShow((prev) => ({
                ...prev,
                [options.objKey]: options.isToggle ? !options.state : true,
              }))
            : options.setShow(options.isToggle ? !options.state : true);
        }
      }
    }
  };

  const handleKeyEscape = (event, options) => {
    if (event.key === "Escape") {
      if (options) {
        if (options.setShow) {
          options.objKey
            ? options.setShow((prev) => ({
                ...prev,
                [options.objKey]: options.isToggle ? !options.state : false,
              }))
            : options.setShow(options.isToggle ? !options.state : false);
        }
      }
    }
  };

  const initializeKeyboardLock = (ref) => {
    const focusableElements = ref.current.querySelectorAll([
        "a[href]",
        "#navigable",
        "button",
        "input",
        "textarea",
        "select",
      ]),
      firstFocusableElement = focusableElements[0],
      lastFocusableElement = focusableElements[focusableElements.length - 1];

    return { firstFocusableElement, lastFocusableElement };
  };

  // To lock the keyboard navigation to only the modal.
  const handleKeyboardLockOnElement = (event, options) => {
    if (event.key === "Tab") {
      if (
        event.shiftKey &&
        document.activeElement === options.firstFocusableElement
      ) {
        event.preventDefault();
        options.lastFocusableElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === options.lastFocusableElement
      ) {
        event.preventDefault();
        options.firstFocusableElement.focus();
      }
    } else if (event.key === "Enter" || event.key === " ") {
      if (
        document.activeElement.id === "navigable" &&
        document.activeElement.getAttribute("role") === "button"
      )
        return;

      document.activeElement.click();
    }
  };

  return {
    handleKeyDown,
    handleKeyEscape,
    initializeKeyboardLock,
    handleKeyboardLockOnElement,
  };
};

export default useKeyboardHelper;
