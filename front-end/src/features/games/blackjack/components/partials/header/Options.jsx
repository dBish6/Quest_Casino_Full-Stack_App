// *Design Imports*
import { Text, Link, Icon } from "@chakra-ui/react";
import { MdVolumeUp, MdVolumeOff, MdOutlineArrowBack } from "react-icons/md";

const Options = (props) => {
  return (
    <>
      <Link
        data-group
        tabIndex="0"
        id="navigable"
        onClick={() => {
          props.toggleMute();
          props.setClicked(!props.clicked);
        }}
        variant="blackjackDropdown"
        mobile={props.isSmallerThan481.toString()}
        display="flex"
        alignItems="center"
        gap="6px"
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
            textShadow: "1px 1px 0px #000",
          }}
        >
          Mute Sounds
        </Text>
        <Icon
          as={!props.clicked ? MdVolumeUp : MdVolumeOff}
          fontSize="21px"
          color="wMain"
          opacity={props.isSmallerThan481 ? "1" : "0.8"}
          _groupHover={{
            opacity: "1",
          }}
        />
      </Link>
      <Link
        data-group
        tabIndex="0"
        id="navigable"
        onClick={() =>
          props.setShow({
            ...props.show,
            options: false,
          })
        }
        variant="blackjackDropdown"
        mobile={props.isSmallerThan481.toString()}
        display="flex"
        alignItems="center"
        gap="6px"
        borderBottomRadius="6px"
      >
        <Icon
          as={MdOutlineArrowBack}
          fontSize="1.5rem"
          color="wMain"
          opacity={props.isSmallerThan481 ? "1" : "0.8"}
          _groupHover={{
            opacity: "1",
          }}
        />
        <Text
          fontSize="18px"
          fontWeight={props.isSmallerThan481 ? "600" : "500"}
          color="wMain"
          opacity={props.isSmallerThan481 ? "1" : "0.8"}
          textShadow="1px 1px 0px #000"
          _groupHover={{
            opacity: "1",
            textShadow: "1px 1px 0px #000",
          }}
        >
          Return
        </Text>
      </Link>
    </>
  );
};

export default Options;
