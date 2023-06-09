// *Design Imports*
import { HStack, Button } from "@chakra-ui/react";

// *Custom Hooks Imports*
import useDisableScroll from "../../hooks/useDisableScroll";

// *Component Imports*
import ModalTemplate from "./ModalTemplate";
import MyHeading from "../MyHeading";

const AreYouSureModal = (props) => {
  useDisableScroll(
    typeof props.show === "object" ? props.show.areYouSure : props.show,
    510
  );

  return (
    <ModalTemplate
      show={typeof props.show === "object" ? props.show.areYouSure : props.show}
      setShow={props.setShow}
      objName={typeof props.show === "object" && "areYouSure"}
      animation={{ type: "up", y: "200%" }}
      loading={props.loading}
      maxW="325px"
    >
      <MyHeading fontSize="32px" mb="1.5rem" text="Are you Sure?" />

      <HStack>
        <Button
          isLoading={props.loading}
          aria-disabled={props.loading}
          onClick={() => {
            if (props.handleProfilePicture) {
              props.handleProfilePicture(
                props.profilePic,
                props.setSelectedPicture,
                false,
                props.show,
                props.setShow
              );
            } else if (props.handleDeleteProfile) {
              props.handleDeleteProfile();
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
          aria-disabled={props.loading}
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
