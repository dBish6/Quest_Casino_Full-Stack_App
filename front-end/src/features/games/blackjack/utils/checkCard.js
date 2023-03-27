const checkCard = (card, wants11) => {
  if (["J", "Q", "K"].includes(card.face)) {
    return 10;
  }

  if (card.face === "A" && wants11 === 1) {
    return 1;
  } else if (card.face === "A" && wants11 === 11) {
    return 11;
  } else if (card.face === "A" && wants11 === 0) {
    return 0;
  } else if (card.face === "A") {
    return 0;
  }

  return card.face;
};

export default checkCard;
