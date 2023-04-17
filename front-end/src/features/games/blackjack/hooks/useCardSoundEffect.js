/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import SlidingCard1 from "../assets/sounds/SlidingCard1.mp3";
import SlidingCard2 from "../assets/sounds/SlidingCard2.mp3";
import SlidingCard3 from "../assets/sounds/SlidingCard3.mp3";

const useCardSoundEffect = (playerCards, dealerCards) => {
  const [prevCardLength, setPrevCardLength] = useState({
    player: -1,
    dealer: -1,
  });
  const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);
  const [muteSounds, toggleMuteSound] = useState(false);
  const slidingCardSoundEffects = [
    new Audio(SlidingCard1),
    new Audio(SlidingCard2),
    new Audio(SlidingCard3),
  ];

  const handleCardEffectEnd = () => {
    slidingCardSoundEffects.forEach((sound) => {
      sound.pause();
    });
  };

  const getRandomIndex = (lastIndex, arrayLength) => {
    let index = Math.floor(Math.random() * arrayLength);
    if (index === lastIndex) {
      // Checks if the randomly chosen index is the same as the last played index.
      index = (index + 1) % arrayLength;
    }
    return index;
  };

  useEffect(() => {
    if (
      playerCards.length > 0 &&
      playerCards.length > prevCardLength.player &&
      !muteSounds
    ) {
      let randomIndex = getRandomIndex(
        lastPlayedIndex,
        slidingCardSoundEffects.length
      );
      setLastPlayedIndex(randomIndex);

      const chosenSoundEffect = slidingCardSoundEffects[randomIndex];
      chosenSoundEffect.play();
      chosenSoundEffect.addEventListener("ended", handleCardEffectEnd);

      return () => {
        chosenSoundEffect.removeEventListener("ended", handleCardEffectEnd);
      };
    }
    setPrevCardLength({ ...prevCardLength, player: playerCards.length });
  }, [playerCards]);

  useEffect(() => {
    if (
      dealerCards.length > 0 &&
      dealerCards.length > prevCardLength.dealer &&
      !muteSounds
    ) {
      let randomIndex = getRandomIndex(
        lastPlayedIndex,
        slidingCardSoundEffects.length
      );
      setLastPlayedIndex(randomIndex);

      const chosenSoundEffect = slidingCardSoundEffects[randomIndex];
      chosenSoundEffect.play();
      chosenSoundEffect.addEventListener("ended", handleCardEffectEnd);

      return () => {
        chosenSoundEffect.removeEventListener("ended", handleCardEffectEnd);
      };
    }
    setPrevCardLength({ ...prevCardLength, dealer: dealerCards.length });
  }, [dealerCards]);

  const toggleMute = () => {
    toggleMuteSound(!muteSounds);
  };

  return toggleMute;
};

export default useCardSoundEffect;
