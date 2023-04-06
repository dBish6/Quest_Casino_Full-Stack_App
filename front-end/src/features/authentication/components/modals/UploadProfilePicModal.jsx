// *Design Imports*
import {
  Input,
  chakra,
  Box,
  Button,
  Text,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";

// *Custom Hooks Imports*
import useDisableScroll from "../../../../hooks/useDisableScroll";

// *Component Imports*
import ModalTemplate from "../../../../components/modals/ModalTemplate";
import Header from "../../../../components/Header";

const UploadProfilePicModal = (props) => {
  const { colorMode } = useColorMode();
  useDisableScroll(props.show.uploadPicture, 510);

  return (
    <>
      {props.loading && (
        <Spinner
          position="fixed"
          top="50%"
          left="49%"
          size="lg"
          color={colorMode === "dark" ? "p500" : "r500"}
          zIndex="1500"
        />
      )}
      <Box opacity={props.loading ? "0.9" : "1"} transition="0.38s ease">
        <ModalTemplate
          show={props.show.uploadPicture}
          setShow={props.setShow}
          objName="uploadPicture"
          loading={props.loading}
          animation={{ type: "up", y: "200%" }}
          display="grid"
          p="1.5rem 1.5rem 1rem 1.5rem"
          maxW="325px"
        >
          <Button
            isDisabled={props.loading}
            onClick={() =>
              props.setShow({ ...props.show, uploadPicture: false })
            }
            variant="exit"
            position="absolute"
            top="-8px"
            right="-8px"
          >
            &#10005;
          </Button>
          <Header fontSize="32px" mb="1.5rem" text="Upload Image" />

          <Box
            borderWidth="1px"
            borderColor={colorMode === "dark" ? "borderD" : "borderL"}
            borderRadius="6px"
            p="0.5rem 0"
          >
            <Input
              type="file"
              accept="/image/*"
              isDisabled={props.loading}
              onChange={(file) =>
                props.handleProfilePicture(
                  props.userId,
                  file,
                  props.setSelectedPicture,
                  true
                )
              }
              variant="unstyled"
              p="0 0.5rem"
              _hover={{ boxShadow: "none" }}
            />
          </Box>
          <Text as="small" textAlign="center" mt="0.5rem">
            <chakra.span fontSize="14px">Formats:</chakra.span> jpg or png.
          </Text>
        </ModalTemplate>
      </Box>
    </>
  );
};

export default UploadProfilePicModal;
