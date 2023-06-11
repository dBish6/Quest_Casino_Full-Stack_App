/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

// *Design Imports*
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import streakFlame from "../../assets/streak.json";

const Streak = ({ gameType, winStreak, animate, setAnimate }) => {
  const flameAnimationRef = useRef(null);
  const ANIMATION_DUR = 3500;

  useEffect(() => {
    if (winStreak !== 0) {
      setAnimate((prev) => ({ ...prev, winStreak: true }));
      flameAnimationRef.current.play();
      const end = setTimeout(() => {
        flameAnimationRef.current.pause();
        setAnimate((prev) => ({ ...prev, winStreak: false }));
      }, ANIMATION_DUR);

      return () => clearTimeout(end);
    } else {
      flameAnimationRef.current.stop();
    }
  }, [winStreak]);

  return (
    <Box
      as={motion.div}
      animate={
        animate.winStreak && winStreak !== 0
          ? {
              scale: [1.35, 1.2, 1.35, 1.2, 1.35, 1.35, 1.35, 1.35],
              y: -16,
              transition: {
                scale: { duration: 1.8, ease: "easeIn" },
                y: { duration: 0.5, ease: "easeOut" },
              },
            }
          : {
              scale: 1,
              y: 0,
              transition: {
                duration: 1.1,
                ease: "easeOut",
              },
            }
      }
      pos="absolute"
      bottom="1rem"
      right={{
        base: "1.5rem",
        md: "3rem",
        xl: "5rem",
      }}
      pointerEvents="none"
    >
      <Lottie
        aria-label="Streak Flame"
        animationData={streakFlame}
        lottieRef={flameAnimationRef}
        loop={false}
        style={{ width: winStreak < 10 ? "52px" : "60px" }}
      />
      <Text
        aria-label="Win Streak"
        variant="blackjack"
        pos="absolute"
        top="70%"
        left={winStreak < 10 ? "49%" : "47%"}
        transform="translate(-50%, -50%)"
        zIndex="2"
      >
        {winStreak}
      </Text>
    </Box>
  );
};

export default Streak;
