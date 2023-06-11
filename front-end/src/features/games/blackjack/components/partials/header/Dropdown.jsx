import { useNavigate } from "react-router-dom";

// *Design Imports*
import { Text, VStack, Link } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import fadeUp from "../../../../general/utils/animations/menuFadeUp";

// *Component Import*
import Options from "./Options";

const Dropdown = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <AnimatePresence>
        {props.showDropdown && (
          <VStack
            role="menu"
            aria-label="Menu"
            as={motion.div}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            position="absolute"
            top="1.5rem"
            right={{ base: "-3rem", md: "-3rem", xl: "unset" }}
            w="max-content"
            bgColor={
              props.isSmallerThan481 ? "#DBDBDB" : "rgba(244, 244, 244, 0.5)"
            }
            borderWidth="1px"
            borderColor="rgb(0, 0, 0)"
            borderRadius="6px"
            zIndex="dropdown"
          >
            {props.show.options ? (
              <Options
                toggleMute={props.toggleMute}
                show={props.show}
                setShow={props.setShow}
                clicked={props.clicked}
                setClicked={props.setClicked}
                isSmallerThan481={props.isSmallerThan481}
              />
            ) : (
              <>
                <Link
                  data-group
                  tabIndex="0"
                  id="navigable"
                  onClick={() => navigate(-1)}
                  variant="blackjackDropdown"
                  mobile={props.isSmallerThan481.toString()}
                  borderTopRadius="6px"
                >
                  <Text
                    fontSize="18px"
                    fontWeight={props.isSmallerThan481 ? "600" : "500"}
                    color="wMain"
                    opacity={props.isSmallerThan481 ? "1" : "0.8"}
                    textShadow="1px 1px 0px #000"
                    _groupHover={{
                      opacity: "1",
                    }}
                  >
                    Exit Game
                  </Text>
                </Link>

                <Link
                  data-group
                  tabIndex="0"
                  id="navigable"
                  onClick={() => props.setShow({ ...props.show, cashIn: true })}
                  variant="blackjackDropdown"
                  mobile={props.isSmallerThan481.toString()}
                >
                  <Text
                    fontSize="18px"
                    fontWeight={props.isSmallerThan481 ? "600" : "500"}
                    color="wMain"
                    opacity={props.isSmallerThan481 ? "1" : "0.8"}
                    textShadow="1px 1px 0px #000"
                    _groupHover={{
                      opacity: "1",
                    }}
                  >
                    Cash In
                  </Text>
                </Link>

                <Link
                  data-group
                  tabIndex="0"
                  id="navigable"
                  onClick={() =>
                    props.setShow({
                      ...props.show,
                      gameStart: true,
                      canCancel: true,
                    })
                  }
                  variant="blackjackDropdown"
                  mobile={props.isSmallerThan481.toString()}
                >
                  <Text
                    fontSize="18px"
                    fontWeight={props.isSmallerThan481 ? "600" : "500"}
                    color="wMain"
                    opacity={props.isSmallerThan481 ? "1" : "0.8"}
                    textShadow="1px 1px 0px #000"
                    _groupHover={{
                      opacity: "1",
                    }}
                  >
                    Change Mode
                  </Text>
                </Link>

                <Link
                  data-group
                  tabIndex="0"
                  id="navigable"
                  onClick={() =>
                    props.setShow({
                      ...props.show,
                      options: true,
                    })
                  }
                  variant="blackjackDropdown"
                  mobile={props.isSmallerThan481.toString()}
                >
                  <Text
                    fontSize="18px"
                    fontWeight={props.isSmallerThan481 ? "600" : "500"}
                    color="wMain"
                    opacity={props.isSmallerThan481 ? "1" : "0.8"}
                    textShadow="1px 1px 0px #000"
                    _groupHover={{
                      opacity: "1",
                    }}
                  >
                    Options
                  </Text>
                </Link>

                <Link
                  data-group
                  tabIndex="0"
                  id="navigable"
                  onClick={() => props.setShow({ ...props.show, rules: true })}
                  variant="blackjackDropdown"
                  mobile={props.isSmallerThan481.toString()}
                  borderBottomRadius="6px"
                >
                  <Text
                    fontSize="18px"
                    fontWeight={props.isSmallerThan481 ? "600" : "500"}
                    color="wMain"
                    opacity={props.isSmallerThan481 ? "1" : "0.8"}
                    textShadow="1px 1px 0px #000"
                    _groupHover={{
                      opacity: "1",
                    }}
                  >
                    Rules
                  </Text>
                </Link>
              </>
            )}
          </VStack>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dropdown;
