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
                [options.objKey]: false,
              }))
            : options.toggleVisibility(options.type === "off" ? false : true);
        } else if (options.setShow && options.objKey) {
          options.setShow((prev) => ({ ...prev, [options.objKey]: true }));
        }
      }
    }
  };

  const handleKeyEscape = (event, options) => {
    console.log(event, options);
    if (event.key === "Escape") {
      if (options) {
        if (options.type === "modal" && options.setShow) {
          options.objKey
            ? options.setShow((prev) => ({
                ...prev,
                [options.objKey]: false,
              }))
            : options.setShow(false);
        }
      }
    }
  };

  const initializeKeyboardOnModal = (modalRef) => {
    const focusableElements = modalRef.current.querySelectorAll([
        "a[href]",
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
  const handleModalKeyboardLock = (event, options) => {
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
    }
  };

  return {
    handleKeyDown,
    handleKeyEscape,
    initializeKeyboardOnModal,
    handleModalKeyboardLock,
  };
};

export default useKeyboardHelper;
