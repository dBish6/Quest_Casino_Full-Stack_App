import { useState, useEffect } from "react";

// *Design Imports*
import {
  Wrap,
  WrapItem,
  Image,
  Text,
  Center,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { MdUploadFile } from "react-icons/md";

// *Component Imports*
import DefaultPicsSkeleton from "../skeletons/DefaultPicsSkeleton";
import AreYouSureModal from "../../../../components/modals/AreYouSureModal";
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

  useEffect(() => {
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
  }, []);

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
            let initialCurrent =
              props.currentUser.photoURL === profilePic.url &&
              selectedPicture === "";
            let isCurrent =
              selectedPicture.length && selectedPicture === profilePic.url;

            return (
              <WrapItem
                key={profilePic.name}
                maxW="115px"
                minH="115px"
                cursor={
                  props.loadingUpdate.profilePic ? "not-allowed" : "pointer"
                }
                pointerEvents={props.loadingUpdate.profilePic && "none"}
                onClick={() => {
                  if (initialCurrent || isCurrent) {
                    return;
                  } else {
                    setToBeSelectedPicture(profilePic.url);
                    setShow({ ...show, areYouSure: true });
                  }
                }}
              >
                {initialCurrent || isCurrent ? (
                  <Text
                    position="absolute"
                    bgColor={colorMode === "dark" ? "p500" : "r500"}
                    color={colorMode === "dark" ? "bMain" : "wMain"}
                    fontWeight="500"
                    fontStyle="italic"
                    textAlign="center"
                    borderRadius="32px"
                    pointerEvents="none"
                    w="100%"
                    maxW="115px"
                  >
                    Current
                  </Text>
                ) : undefined}
                <Image
                  src={profilePic.url}
                  alt={`Profile Picture ${i}`}
                  objectFit="contain"
                  borderRadius="50%"
                  bgColor={colorMode === "dark" ? "bd100" : "wMain"}
                  _hover={{
                    bgColor: colorMode === "dark" ? "wMain" : "#E0E2EA",
                  }}
                  _active={{
                    bgColor:
                      props.currentUser.photoURL === profilePic.url || isCurrent
                        ? "r500"
                        : "g400",
                  }}
                  transition="0.2s ease"
                />
              </WrapItem>
            );
          })
        )}
        <WrapItem
          w="100%"
          maxW="115px"
          minH="115px"
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
          {(props.currentUser.photoURL.indexOf("userProfilePics") !== -1 &&
            selectedPicture === "") ||
          selectedPicture.indexOf("userProfilePics") !== -1 ? (
            <Text
              position="absolute"
              bgColor={colorMode === "dark" ? "p500" : "r500"}
              color={colorMode === "dark" ? "bMain" : "wMain"}
              fontWeight="500"
              fontStyle="italic"
              textAlign="center"
              borderRadius="32px"
              pointerEvents="none"
              w="100%"
              maxW="115px"
            >
              Current
            </Text>
          ) : (
            <Center w="100%" h="100%">
              <Icon as={MdUploadFile} fontSize="4rem" color="bMain" />
            </Center>
          )}

          {(props.currentUser.photoURL.indexOf("userProfilePics") !== -1 &&
            selectedPicture === "") ||
          selectedPicture.indexOf("userProfilePics") !== -1 ? (
            <Image
              src={
                selectedPicture.indexOf("userProfilePics") !== -1
                  ? selectedPicture
                  : props.currentUser.photoURL
              }
              alt="Upload Profile Picture"
              objectFit="cover"
              objectPosition="center center"
              borderRadius="50%"
            />
          ) : undefined}
        </WrapItem>
      </Wrap>

      <AreYouSureModal
        show={show}
        setShow={setShow}
        loading={props.loadingUpdate.profilePic}
        handleProfilePicture={props.handleProfilePicture}
        userId={props.currentUser.uid}
        profilePic={toBeSelectedPicture}
        setSelectedPicture={setSelectedPicture}
      />
      <UploadProfilePicModal
        show={show}
        setShow={setShow}
        loading={props.loadingUpdate.profilePic}
        setSelectedPicture={setSelectedPicture}
        handleProfilePicture={props.handleProfilePicture}
        userId={props.currentUser.uid}
      />
    </>
  );
};

export default ChangePicture;
