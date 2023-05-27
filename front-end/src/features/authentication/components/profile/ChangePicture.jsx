/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

// *Design Imports*
import {
  Wrap,
  WrapItem,
  Avatar,
  Image,
  Text,
  Center,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { MdUploadFile } from "react-icons/md";

// *Component Imports*
import DefaultPicsSkeleton from "../skeletons/DefaultPicsSkeleton";
import UploadProfilePicModal from "../modals/UploadProfilePicModal";

// *Utility Import*
import { storage } from "../../../../utils/firebaseConfig";
// Firebase Imports...
import { listAll, ref, getDownloadURL } from "firebase/storage";

const ChangePicture = (props) => {
  const { colorMode } = useColorMode();
  const [show, setShow] = useState({ areYouSure: false, uploadPicture: false });

  const [defaultPictures, setDefaultPictures] = useState([]);
  const [selectedPicture, setSelectedPicture] = useState("");
  const [toBeSelectedPicture, setToBeSelectedPicture] = useState("");
  let isCustomCurrent =
    (props.currentUser.photoURL &&
      props.currentUser.photoURL.indexOf("userProfilePics") !== -1 &&
      selectedPicture === "") ||
    selectedPicture.indexOf("userProfilePics") !== -1;

  useEffect(() => {
    if (props.onPictureTab) {
      const getFirebaseImages = async () => {
        const res = await listAll(ref(storage, "images/defaultProfilePics/"));
        const urls = await Promise.all(
          res.items.map(async (img) => {
            const url = await getDownloadURL(img);
            return { name: img.name, url: url };
          })
        );
        setDefaultPictures(urls);
      };
      getFirebaseImages();
    }
  }, [props.onPictureTab]);

  return (
    <>
      <Wrap spacing="2rem" justify="center" mt="1.5rem">
        {defaultPictures.length < 15 ? (
          <>
            <DefaultPicsSkeleton />
          </>
        ) : (
          defaultPictures.map((profilePic, i) => {
            // So it can update in real time.
            let isCurrent =
              (props.currentUser.photoURL === profilePic.url &&
                selectedPicture === "") ||
              (selectedPicture.length && selectedPicture === profilePic.url);

            return (
              <WrapItem
                key={profilePic.name}
                w="115px"
                h="115px"
                cursor={
                  props.loadingUpdate.profilePic ? "not-allowed" : "pointer"
                }
                pointerEvents={props.loadingUpdate.profilePic && "none"}
                onClick={() => {
                  if (isCurrent) {
                    return;
                  } else {
                    setToBeSelectedPicture(profilePic.url);
                    setShow({ ...show, areYouSure: true });
                  }
                }}
              >
                {isCurrent ? (
                  <Text
                    position="absolute"
                    bgColor={colorMode === "dark" ? "p500" : "r500"}
                    color={colorMode === "dark" ? "bMain" : "wMain"}
                    fontWeight="500"
                    fontStyle="italic"
                    textAlign="center"
                    borderRadius="32px"
                    pointerEvents="none"
                    w="115px"
                  >
                    Current
                  </Text>
                ) : undefined}
                <Image
                  src={profilePic.url}
                  alt={`Profile Picture ${i}`}
                  loading="lazy"
                  objectFit="contain"
                  borderRadius="50%"
                  bgColor={colorMode === "dark" ? "bd100" : "wMain"}
                  _hover={{
                    bgColor: colorMode === "dark" ? "wMain" : "#E0E2EA",
                  }}
                  _active={{
                    bgColor: isCurrent ? "r500" : "g400",
                  }}
                  transition="0.2s ease"
                />
              </WrapItem>
            );
          })
        )}

        <WrapItem
          position="relative"
          w="115px"
          h="115px"
          borderRadius="50%"
          bgColor={colorMode === "dark" ? "bd100" : "wMain"}
          cursor={props.loadingUpdate.profilePic ? "not-allowed" : "pointer"}
          pointerEvents={props.loadingUpdate.profilePic && "none"}
          _hover={{
            bgColor: colorMode === "dark" ? "wMain" : "#E0E2EA",
          }}
          _active={{
            bgColor: "g400",
          }}
          onClick={() => setShow({ ...show, uploadPicture: true })}
        >
          {isCustomCurrent ? (
            <>
              <Text
                position="absolute"
                top="-1.5rem"
                bgColor={colorMode === "dark" ? "p500" : "r500"}
                color={colorMode === "dark" ? "bMain" : "wMain"}
                fontWeight="500"
                fontStyle="italic"
                textAlign="center"
                borderRadius="32px"
                pointerEvents="none"
                w="115px"
                zIndex="1"
              >
                Current
              </Text>
              <Avatar
                src={
                  selectedPicture.indexOf("userProfilePics") !== -1
                    ? selectedPicture
                    : props.currentUser.photoURL
                }
                alt={`${props.currentUser.displayName}'s Profile Picture`}
                w="115px"
                h="115px"
              />
            </>
          ) : (
            <Center w="100%" h="100%">
              <Icon as={MdUploadFile} fontSize="4rem" color="bMain" />
            </Center>
          )}
        </WrapItem>
      </Wrap>

      <props.AreYouSureModal
        show={show}
        setShow={setShow}
        loading={props.loadingUpdate.profilePic}
        handleProfilePicture={props.handleProfilePicture}
        profilePic={toBeSelectedPicture}
        setSelectedPicture={setSelectedPicture}
      />
      <UploadProfilePicModal
        show={show}
        setShow={setShow}
        loading={props.loadingUpdate.profilePic}
        setSelectedPicture={setSelectedPicture}
        handleProfilePicture={props.handleProfilePicture}
      />
    </>
  );
};

export default ChangePicture;
