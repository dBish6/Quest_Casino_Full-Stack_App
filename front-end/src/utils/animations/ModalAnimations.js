const ModalAnimations = (animation) => {
  return {
    modelBackdrop: {
      visible: {
        opacity: 1,
        transition: {
          duration: 1,
          type: "ease",
        },
      },
      hidden: {
        opacity: 0,
        transition: {
          duration: 1,
          type: "ease",
        },
      },
    },

    modelFadeDown: {
      visible: {
        y: "-50%",
        x: "-50%",
        opacity: 1,
        transition: {
          y: { type: "spring", stiffness: 50 },
          opacity: { duration: 0.8 },
        },
      },
      hidden: {
        y: animation.y,
        x: "-50%",
        opacity: 0,
        transition: {
          duration: 0.8,
          type: "tween",
        },
      },
    },

    modelFadeUp: {
      visible: {
        scale: 1.0,
        y: "-50%",
        x: "-50%",
        opacity: 1,
        transition: {
          y: { type: "spring", stiffness: 50 },
        },
      },
      hidden: {
        scale: 1.0,
        y: animation.y,
        x: "-50%",
        opacity: 0,
      },
      exit: {
        scale: 0.8,
        x: "-50%",
        opacity: 0,
        transition: {
          duration: 0.5,
          type: "tween",
        },
      },
    },
  };
};

export default ModalAnimations;
