const fadeUp = {
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.48,
      type: "tween",
    },
  },
  hidden: {
    y: "30px",
    opacity: 0,
    transition: {
      duration: 0.38,
      type: "tween",
    },
  },
};

export default fadeUp;
