// *Design Imports*
import {
  Heading,
  HStack,
  Text,
  chakra,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorMode,
  Divider,
} from "@chakra-ui/react";

// *Custom Hooks Imports*
import useCache from "../../../../hooks/useCache";
import useDisableScroll from "../../../../hooks/useDisableScroll";

// *Utility Imports*
import quests from "../../staticQuests";

// *Component Imports*
import ModalTemplate from "../../../../components/modals/ModalTemplate";
import MyHeading from "../../../../components/MyHeading";

const QuestsModal = (props) => {
  const { colorMode } = useColorMode();
  const { cache } = useCache();

  useDisableScroll(
    typeof props.show === "object" ? props.show.quests : props.show,
    810
  );

  return (
    <ModalTemplate
      show={typeof props.show === "object" ? props.show.quests : props.show}
      setShow={props.setShow}
      objName={typeof props.show === "object" && "quests"}
      animation={{ type: "up", y: "200%" }}
      maxW="max-content"
    >
      <MyHeading fontSize="2rem" text="Quests" mb="0.5rem" />
      <Text textAlign="center" mb="1.5rem">
        Here are the featured quests for you to complete, if you desire, to earn
        some extra cash!
      </Text>

      <HStack
        justify="center"
        align="flex-start"
        flexWrap="wrap"
        gap="1rem 1.5rem"
      >
        {quests.map((detail) => {
          const isCompleted =
            cache.userProfile &&
            cache.userProfile.completed_quests.some(
              (quest) => quest === detail.title
            );

          return (
            <Card
              key={detail.title}
              variant="primary"
              maxW="225px"
              bg={!isCompleted && "transparent"}
              bgColor={
                isCompleted && (colorMode === "dark" ? "bd500" : "bl200")
              }
            >
              {/* TODO: Make better. */}
              {isCompleted && (
                <Text
                  aria-label="Completed"
                  pos="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%) rotate(45deg)"
                  p="0 0.5rem"
                  fontFamily="roboto"
                  fontSize="26px"
                  fontWeight="600"
                  letterSpacing="4pt"
                  color="g600"
                  bgColor="g200"
                  opacity="0.65"
                  borderWidth="1px"
                  borderColor="g600"
                  borderRadius="6px"
                  zIndex="1"
                >
                  Completed
                </Text>
              )}
              <CardHeader>
                <Heading
                  fontFamily="roboto"
                  fontSize="24px"
                  fontWeight="600"
                  fontStyle="italic"
                  lineHeight="1.2"
                >
                  {detail.title}
                </Heading>
              </CardHeader>
              <Divider />
              <CardBody>
                <Text
                  aria-label={`${detail.title}'s Description`}
                  opacity="0.9"
                >
                  {detail.description}
                </Text>
              </CardBody>
              <CardFooter>
                <Text
                  aria-label={`${detail.title}'s Reward`}
                  fontSize="18px"
                  fontWeight="500"
                >
                  Reward:{" "}
                  <chakra.span fontSize="16px" fontWeight="600" color="g500">
                    ${detail.reward}
                  </chakra.span>
                </Text>
              </CardFooter>
            </Card>
          );
        })}
      </HStack>
    </ModalTemplate>
  );
};

export default QuestsModal;
