// prettier-ignore

// Creates un-shuffled deck.
const createDeck = () => {
  const deck = [
    { face: "A", suit: "hearts", image: require("../assets/images/ace_of_hearts.png") },
    { face: "A", suit: "diamonds", image: require("../assets/images/ace_of_diamonds.png") },
    { face: "A", suit: "spades", image: require("../assets/images/ace_of_spades.png") },
    { face: "A", suit: "clubs", image: require("../assets/images/ace_of_clubs.png") },

    { face: 2, suit: "hearts", image: require("../assets/images/2_of_hearts.png"), },
    { face: 2, suit: "diamonds", image: require("../assets/images/2_of_diamonds.png") },
    { face: 2, suit: "spades", image: require("../assets/images/2_of_spades.png") },
    { face: 2, suit: "clubs", image: require("../assets/images/2_of_clubs.png") },

    { face: 3, suit: "hearts", image: require("../assets/images/3_of_hearts.png") },
    { face: 3, suit: "diamonds", image: require("../assets/images/3_of_diamonds.png") },
    { face: 3, suit: "spades", image: require("../assets/images/3_of_spades.png") },
    { face: 3, suit: "clubs", image: require("../assets/images/3_of_clubs.png") },

    { face: 4, suit: "hearts", image: require("../assets/images/4_of_hearts.png") },
    { face: 4, suit: "diamonds", image: require("../assets/images/4_of_diamonds.png") },
    { face: 4, suit: "spades", image: require("../assets/images/4_of_spades.png") },
    { face: 4, suit: "clubs", image: require("../assets/images/4_of_clubs.png") },

    { face: 5, suit: "hearts", image: require("../assets/images/5_of_hearts.png") },
    { face: 5, suit: "diamonds", image: require("../assets/images/5_of_diamonds.png") },
    { face: 5, suit: "spades", image: require("../assets/images/5_of_spades.png") },
    { face: 5, suit: "clubs", image: require("../assets/images/5_of_clubs.png") },

    { face: 6, suit: "hearts", image: require("../assets/images/6_of_hearts.png") },
    { face: 6, suit: "diamonds", image: require("../assets/images/6_of_diamonds.png") },
    { face: 6, suit: "spades", image: require("../assets/images/6_of_spades.png") },
    { face: 6, suit: "clubs", image: require("../assets/images/6_of_clubs.png") },

    { face: 7, suit: "hearts", image: require("../assets/images/7_of_hearts.png") },
    { face: 7, suit: "diamonds", image: require("../assets/images/7_of_diamonds.png") },
    { face: 7, suit: "spades", image: require("../assets/images/7_of_spades.png") },
    { face: 7, suit: "clubs", image: require("../assets/images/7_of_clubs.png") },

    { face: 8, suit: "hearts", image: require("../assets/images/8_of_hearts.png") },
    { face: 8, suit: "diamonds", image: require("../assets/images/8_of_diamonds.png") },
    { face: 8, suit: "spades", image: require("../assets/images/8_of_spades.png") },
    { face: 8, suit: "clubs", image: require("../assets/images/8_of_clubs.png") },

    { face: 9, suit: "hearts", image: require("../assets/images/9_of_hearts.png") },
    { face: 9, suit: "diamonds", image: require("../assets/images/9_of_diamonds.png") },
    { face: 9, suit: "spades", image: require("../assets/images/9_of_spades.png") },
    { face: 9, suit: "clubs", image: require("../assets/images/9_of_clubs.png") },

    { face: 10, suit: "hearts", image: require("../assets/images/10_of_hearts.png") },
    { face: 10, suit: "diamonds", image: require("../assets/images/10_of_diamonds.png") },
    { face: 10, suit: "spades", image: require("../assets/images/10_of_spades.png") },
    { face: 10, suit: "clubs", image: require("../assets/images/10_of_clubs.png") },

    { face: "J", suit: "hearts", image: require("../assets/images/jack_of_hearts.png") },
    { face: "J", suit: "diamonds", image: require("../assets/images/jack_of_diamonds.png") },
    { face: "J", suit: "spades", image: require("../assets/images/jack_of_spades.png") },
    { face: "J", suit: "clubs", image: require("../assets/images/jack_of_clubs.png") },

    { face: "Q", suit: "hearts", image: require("../assets/images/queen_of_hearts.png") },
    { face: "Q", suit: "diamonds", image: require("../assets/images/queen_of_diamonds.png") },
    { face: "Q", suit: "spades", image: require("../assets/images/queen_of_spades.png") },
    { face: "Q", suit: "clubs", image: require("../assets/images/queen_of_clubs.png") },

    { face: "K", suit: "hearts", image: require("../assets/images/king_of_hearts.png") },
    { face: "K", suit: "diamonds", image: require("../assets/images/king_of_diamonds.png") },
    { face: "K", suit: "spades", image: require("../assets/images/king_of_spades.png") },
    { face: "K", suit: "clubs", image: require("../assets/images/king_of_clubs.png") },
    // TODO: Check naturals when animations are done.
    // { face: "A", suit: "clubs", image: require("../assets/images/ace_of_clubs.png") },
    // { face: "A", suit: "clubs", image: require("../assets/images/ace_of_clubs.png") },
    // { face: 4, suit: "hearts", image: require("../assets/images/4_of_hearts.png") },
    // { face: "Q", suit: "hearts", image: require("../assets/images/queen_of_hearts.png") },
    // { face: 4, suit: "hearts", image: require("../assets/images/4_of_hearts.png") },
  ];

  return deck;
};

export default createDeck;
