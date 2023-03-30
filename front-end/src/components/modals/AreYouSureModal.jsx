import { useEffect } from "react";

// *Design Imports*
import { HStack, Button } from "@chakra-ui/react";

// *Component Imports*
import ModalTemplate from "./ModalTemplate";
import Header from "../Header";

const AreYouSureModal = (props) => {
  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 510);
    }
  }, [props.show]);

  return (
    <ModalTemplate
      show={typeof props.show === "object" ? props.show.areYouSure : props.show}
      setShow={props.setShow}
      objName={typeof props.show === "object" && "areYouSure"}
      animation={{ type: "up", y: "200%" }}
      maxW="325px"
    >
      <Button
        isDisabled={props.loading}
        onClick={() =>
          typeof props.show === "object"
            ? props.setShow({ ...props.show, areYouSure: false })
            : props.setShow(false)
        }
        variant="exit"
        position="absolute"
        top="-8px"
        right="-8px"
      >
        &#10005;
      </Button>
      <Header fontSize="32px" mb="1.5rem" text="Are you Sure?" />

      <HStack>
        <Button
          isLoading={props.loading ? true : false}
          onClick={() => {
            if (props.handleProfilePicture) {
              props.handleProfilePicture(
                props.userId,
                props.profilePic,
                props.setSelectedPicture
              );
            }
          }}
          type="submit"
          variant="primary"
          w="100%"
        >
          Yes
        </Button>
        <Button
          isDisabled={props.loading}
          onClick={() =>
            typeof props.show === "object"
              ? props.setShow({ ...props.show, areYouSure: false })
              : props.setShow(false)
          }
          variant="secondary"
          w="100%"
        >
          Cancel
        </Button>
      </HStack>
    </ModalTemplate>
  );
};

export default AreYouSureModal;
