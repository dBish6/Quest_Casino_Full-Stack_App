import { type Variants } from "framer-motion";

export default (duration?: { in: number; out: number }): Variants => ({
  visible: {
    opacity: 1,
    transition: {
      ease: "easeInOut",
      duration: duration?.in,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      ease: "easeOut",
      duration: duration?.out,
    },
  },
});
