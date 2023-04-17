const fadeInAnimations = (var2Scale, var2Duration) => {
  return {
    fadeInVar1: {
      visible: {
        scaleX: 1,
        opacity: 1,
        transition: {
          duration: 0.5,
          type: "spring",
        },
      },
      hidden: {
        scaleX: 0.65,
        opacity: 0,
      },
    },

    fadeInVar2: {
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: var2Duration ? var2Duration : 0.38,
          type: "tween",
        },
      },
      hidden: {
        scale: var2Scale,
        opacity: 0,
        transition: {
          duration: var2Duration ? var2Duration : 0.38,
          type: "tween",
        },
      },
    },
  };
};

export default fadeInAnimations;
