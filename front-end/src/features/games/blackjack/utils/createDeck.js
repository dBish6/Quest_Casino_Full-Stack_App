import cardBundle from "../assets/cardBundle";

// Creates un-shuffled deck.
const createDeck = () => {
  const deck = [
    { face: "A", suit: "hearts", image: cardBundle.heartsAce },
    { face: "A", suit: "diamonds", image: cardBundle.diamondsAce },
    { face: "A", suit: "spades", image: cardBundle.spadesAce },
    { face: "A", suit: "clubs", image: cardBundle.clubsAce },

    { face: 2, suit: "hearts", image: cardBundle.hearts2 },
    { face: 2, suit: "diamonds", image: cardBundle.diamonds2 },
    { face: 2, suit: "spades", image: cardBundle.spades2 },
    { face: 2, suit: "clubs", image: cardBundle.clubs2 },

    { face: 3, suit: "hearts", image: cardBundle.hearts3 },
    { face: 3, suit: "diamonds", image: cardBundle.diamonds3 },
    { face: 3, suit: "spades", image: cardBundle.spades3 },
    { face: 3, suit: "clubs", image: cardBundle.clubs3 },

    { face: 4, suit: "hearts", image: cardBundle.hearts4 },
    { face: 4, suit: "diamonds", image: cardBundle.diamonds4 },
    { face: 4, suit: "spades", image: cardBundle.spades4 },
    { face: 4, suit: "clubs", image: cardBundle.clubs4 },

    { face: 5, suit: "hearts", image: cardBundle.hearts5 },
    { face: 5, suit: "diamonds", image: cardBundle.diamonds5 },
    { face: 5, suit: "spades", image: cardBundle.spades5 },
    { face: 5, suit: "clubs", image: cardBundle.clubs5 },

    { face: 6, suit: "hearts", image: cardBundle.hearts6 },
    { face: 6, suit: "diamonds", image: cardBundle.diamonds6 },
    { face: 6, suit: "spades", image: cardBundle.spades6 },
    { face: 6, suit: "clubs", image: cardBundle.clubs6 },

    { face: 7, suit: "hearts", image: cardBundle.hearts7 },
    { face: 7, suit: "diamonds", image: cardBundle.diamonds7 },
    { face: 7, suit: "spades", image: cardBundle.spades7 },
    { face: 7, suit: "clubs", image: cardBundle.clubs7 },

    { face: 8, suit: "hearts", image: cardBundle.hearts8 },
    { face: 8, suit: "diamonds", image: cardBundle.diamonds8 },
    { face: 8, suit: "spades", image: cardBundle.spades8 },
    { face: 8, suit: "clubs", image: cardBundle.clubs8 },

    { face: 9, suit: "hearts", image: cardBundle.hearts9 },
    { face: 9, suit: "diamonds", image: cardBundle.diamonds9 },
    { face: 9, suit: "spades", image: cardBundle.spades9 },
    { face: 9, suit: "clubs", image: cardBundle.clubs9 },

    { face: "J", suit: "hearts", image: cardBundle.heartsJack },
    { face: "J", suit: "diamonds", image: cardBundle.diamondsJack },
    { face: "J", suit: "spades", image: cardBundle.spadesJack },
    { face: "J", suit: "clubs", image: cardBundle.clubsJack },

    { face: "Q", suit: "hearts", image: cardBundle.heartsQueen },
    { face: "Q", suit: "diamonds", image: cardBundle.diamondsQueen },
    { face: "Q", suit: "spades", image: cardBundle.spadesQueen },
    { face: "Q", suit: "clubs", image: cardBundle.clubsQueen },

    { face: "K", suit: "hearts", image: cardBundle.heartsKing },
    { face: "K", suit: "diamonds", image: cardBundle.diamondsKing },
    { face: "K", suit: "spades", image: cardBundle.spadesKing },
    { face: "K", suit: "clubs", image: cardBundle.clubsKing },
  ];

  return deck;
};

export default createDeck;
