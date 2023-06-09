// *Design Imports*
import {
  Input,
  chakra,
  Box,
  Text,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";

// *Custom Hooks Imports*
import useDisableScroll from "../../../../hooks/useDisableScroll";

// *Component Imports*
import ModalTemplate from "../../../../components/modals/ModalTemplate";
import MyHeading from "../../../../components/MyHeading";

const UploadProfilePicModal = (props) => {
  const { colorMode } = useColorMode();
  useDisableScroll(props.show.uploadPicture, 510);

  return (
    <>
      <Box pos opacity={props.loading ? "0.9" : "1"} transition="0.38s ease">
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
          <MyHeading fontSize="32px" mb="1.5rem" text="Upload Image" />

          {props.loading && (
            <Spinner
              position="absolute"
              top="50%"
              left="45%"
              size="lg"
              color={colorMode === "dark" ? "p500" : "r500"}
              zIndex="1500"
            />
          )}
          <Box
            role="presentation"
            borderWidth="1px"
            borderColor={colorMode === "dark" ? "borderD" : "borderL"}
            borderRadius="6px"
            p="0.5rem 0"
          >
            <Input
              aria-label="Upload"
              id="fileInput"
              type="file"
              accept="/image/*"
              isDisabled={props.loading}
              aria-disabled={props.loading}
              onChange={(file) =>
                props.handleProfilePicture(file, props.setSelectedPicture, true)
              }
              variant="unstyled"
              p="0 0.5rem"
              _focusVisible={{
                outline:
                  colorMode === "dark"
                    ? "1px dotted #f4f4f4"
                    : "1px dotted #000",
              }}
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
