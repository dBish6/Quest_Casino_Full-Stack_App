/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";

// *Design Imports*
import { Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const BetPopup = ({ playerBet, animate, setAnimate }) => {
  const left = useRef(0);

  useEffect(() => {
    if (animate.playerBet) {
      left.current = Math.round(Math.random()) % 2 === 0 ? 22 : 35;
      const end = setTimeout(() => {
        setAnimate((prev) => ({ ...prev, playerBet: false }));
      }, 5000);
      return () => clearTimeout(end);
    }
  }, [animate.playerBet]);

  return (
    <>
      <AnimatePresence>
        {animate.playerBet && (
          <Text
            aria-label="Subtracted Current Bet"
            as={motion.p}
            initial={{
              opacity: 0,
              y: 0,
              x: 0,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              y: "-58vh",
              x: [0, 21, -21, 24, -24, 21, -21, 24, -24, 0],
              rotate: [0, 25, -25, 25, -25, 25, -25, 25, -25, 0],
              transition: {
                y: {
                  duration: 5,
                  ease: [0.56, 0.53, 0.73, 0.87],
                },
                x: { duration: 5, ease: "easeInOut" },
                rotate: {
                  duration: 5,
                  ease: "easeInOut",
                  velocity: 10,
                },
              },
            }}
            exit={{
              opacity: 0,
              y: "-59.25vh",
              rotate: 0,
              transition: { duration: 0.38 },
            }}
            variant="blackjack"
            pos="absolute"
            bottom="1"
            left={`${left.current}vw`}
            fontSize="1.5rem"
            color="r500"
          >
            -${playerBet}
          </Text>
        )}
      </AnimatePresence>
    </>
  );
};

export default BetPopup;
