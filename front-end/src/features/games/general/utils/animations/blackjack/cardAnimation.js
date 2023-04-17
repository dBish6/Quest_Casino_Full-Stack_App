const cardAnimation = (player, viewWith, isHeightSmallerThan910) => {
  return {
    slideCard: {
      fromDeck: {
        y: !player ? 0 : isHeightSmallerThan910 ? "-50vh" : "-53.7vh",
        x: viewWith,
        rotate: "180deg",
      },
      toHand: {
        y: 0,
        x: 0,
        rotate: 0,
        transition: {
          duration: !player ? 1 : 1.3,
          type: "tween",
          ease: "easeInOut",
        },
      },
      giveBack: {
        y: !player ? "-165%" : "-450%",
        x: "0vw",
        rotate: !player ? "75deg" : "180deg",
        transition: {
          duration: !player ? 1 : 1.5,
          type: "tween",
          ease: "easeIn",
        },
      },
    },

    slideCardResponsive: {
      fromDeck: {
        y: !player ? "-75vh" : "75vh",
        x: 0,
        rotate: "180deg",
      },
      toHand: {
        y: 0,
        x: 0,
        rotate: 0,
        transition: {
          duration: 1.3,
          type: "tween",
          ease: "easeInOut",
        },
      },
      giveBack: {
        y: !player ? "-165%" : "-450%",
        x: "0vw",
        rotate: !player ? "75deg" : "180deg",
        transition: {
          duration: !player ? 1 : 1.5,
          type: "tween",
          ease: "easeIn",
        },
      },
    },
  };
};

export default cardAnimation;
