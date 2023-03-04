import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Design Imports*
import {
  Input,
  IconButton,
  ButtonGroup,
  HStack,
  Icon,
  Tooltip,
  Text,
  FormControl,
  FormErrorMessage,
  chakra,
  useMediaQuery,
  useColorMode,
} from "@chakra-ui/react";
import { RiUser3Line, RiFileUserLine } from "react-icons/ri";
import {
  MdOutlineEmail,
  MdOutlinePhone,
  MdCheck,
  MdClose,
  MdOutlineEdit,
} from "react-icons/md";

const EditableFields = (props) => {
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  const [isUpdating, setIsUpdating] = useState({
    name: false,
    username: false,
    email: false,
    phone: false,
  });
  const [focused, setFocused] = useState({
    name: false,
    username: false,
    email: false,
    phone: false,
  });
  const { colorMode } = useColorMode();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
    },
  });

  return (
    <>
      {/* Full Name */}
      {!isUpdating.name ? (
        <HStack>
          <Icon
            as={RiFileUserLine}
            variant="primary"
            fontSize={{ base: "20px", md: "24px", xl: "24px" }}
          />
          <Text fontSize={{ base: "16px", md: "18px", xl: "18px" }}>
            {props.fsUser.user.full_name}
          </Text>
          <Tooltip hasArrow label="Edit" variant="primary">
            <IconButton
              icon={
                <MdOutlineEdit fontSize={isSmallerThan768 ? "20px" : "24px"} />
              }
              isLoading={props.loadingUpdate.name ? true : false}
              isDisabled={
                props.loadingUpdate.username ||
                props.loadingUpdate.email ||
                props.loadingUpdate.phone
              }
              onClick={() => setIsUpdating({ name: true })}
              variant="transparency"
              size={isSmallerThan768 ? "xs" : "sm"}
              marginInlineStart="0 !important"
              color={props.loadingUpdate.name && "g500"}
            />
          </Tooltip>
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() =>
            props.handleFullName(
              props.currentUser.uid,
              watch("name"),
              setIsUpdating
            )
          )}
          display="flex"
        >
          <FormControl isInvalid={errors.name}>
            <HStack data-group>
              <Icon
                as={RiFileUserLine}
                variant="primary"
                position="absolute"
                left="0.5rem"
                fontSize={{ base: "20px", md: "24px", xl: "24px" }}
                opacity={!focused.name && "0.2"}
                _groupHover={{ opacity: 1 }}
                color={focused.name && (colorMode === "dark" ? "p500" : "g500")}
              />
              <Input
                {...register("name", {
                  required: "Name is required.",
                })}
                onFocus={() => setFocused({ name: true })}
                onBlur={() => setFocused({ name: false })}
                name="name"
                autoComplete="off"
                placeholder={props.fsUser.user.full_name}
                variant="primary"
                paddingInline="2.25rem 1rem"
                marginInlineStart="0px !important"
                h="42px"
              />
              <ButtonGroup size="sm">
                <IconButton
                  icon={<MdCheck />}
                  type="submit"
                  isLoading={props.loadingUpdate.name ? true : false}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.name ? true : false}
                  onClick={() => setIsUpdating({ name: false })}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="r500"
                  _hover={{ color: "r500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
              </ButtonGroup>
            </HStack>
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <FormErrorMessage>{message}</FormErrorMessage>
              )}
            />
          </FormControl>
        </chakra.form>
      )}

      {/* Username */}
      {!isUpdating.username ? (
        <HStack>
          <Icon
            as={RiUser3Line}
            variant="primary"
            fontSize={{ base: "20px", md: "24px", xl: "24px" }}
          />
          <Text fontSize={{ base: "16px", md: "18px", xl: "18px" }}>
            {props.fsUser.user.username}
          </Text>
          <Tooltip hasArrow label="Edit" variant="primary">
            <IconButton
              icon={
                <MdOutlineEdit fontSize={isSmallerThan768 ? "20px" : "24px"} />
              }
              isLoading={props.loadingUpdate.username ? true : false}
              isDisabled={
                props.loadingUpdate.name ||
                props.loadingUpdate.email ||
                props.loadingUpdate.phone
              }
              onClick={() => setIsUpdating({ username: true })}
              variant="transparency"
              size={isSmallerThan768 ? "xs" : "sm"}
              marginInlineStart="0 !important"
              color={props.loadingUpdate.username && "g500"}
            />
          </Tooltip>
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() =>
            props.handleUsername(
              props.currentUser.uid,
              watch("username"),
              setIsUpdating
            )
          )}
          display="flex"
        >
          <FormControl isInvalid={errors.username}>
            <HStack data-group>
              <Icon
                as={RiUser3Line}
                variant="primary"
                position="absolute"
                left="0.5rem"
                fontSize={{ base: "20px", md: "24px", xl: "24px" }}
                opacity={!focused.username && "0.2"}
                _groupHover={{ opacity: 1 }}
                color={
                  focused.username && (colorMode === "dark" ? "p500" : "g500")
                }
              />
              <Input
                {...register("username", {
                  required: "Username is required.",
                  maxLength: {
                    value: 24,
                    message: "Username can be no more then 24 characters.",
                  },
                  minLength: {
                    value: 3,
                    message: "You can make a better username then that...",
                  },
                })}
                onFocus={() => setFocused({ username: true })}
                onBlur={() => setFocused({ username: false })}
                name="username"
                autoComplete="off"
                placeholder={props.fsUser.user.username}
                variant="primary"
                paddingInline="2.25rem 1rem"
                marginInlineStart="0px !important"
                h="42px"
              />
              <ButtonGroup size="sm">
                <IconButton
                  icon={<MdCheck />}
                  type="submit"
                  isLoading={props.loadingUpdate.username ? true : false}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.username ? true : false}
                  onClick={() => setIsUpdating({ username: false })}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="r500"
                  _hover={{ color: "r500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
              </ButtonGroup>
            </HStack>
            <ErrorMessage
              errors={errors}
              name="username"
              render={({ message }) => (
                <FormErrorMessage>{message}</FormErrorMessage>
              )}
            />
          </FormControl>
        </chakra.form>
      )}

      {/* Email Address */}
      {!isUpdating.email ? (
        <HStack>
          <Icon
            as={MdOutlineEmail}
            variant="primary"
            fontSize={{ base: "20px", md: "24px", xl: "24px" }}
          />
          <Text fontSize={{ base: "16px", md: "18px", xl: "18px" }}>
            {props.fsUser.user.email}
          </Text>
          <Tooltip hasArrow label="Edit" variant="primary">
            <IconButton
              icon={
                <MdOutlineEdit fontSize={isSmallerThan768 ? "20px" : "24px"} />
              }
              isLoading={props.loadingUpdate.email ? true : false}
              isDisabled={
                props.loadingUpdate.username ||
                props.loadingUpdate.name ||
                props.loadingUpdate.phone
              }
              onClick={() => setIsUpdating({ email: true })}
              variant="transparency"
              size={isSmallerThan768 ? "xs" : "sm"}
              marginInlineStart="0 !important"
              color={props.loadingUpdate.email && "g500"}
            />
          </Tooltip>
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() =>
            props.handleEmail(
              props.currentUser.uid,
              watch("email"),
              setIsUpdating
            )
          )}
          display="flex"
        >
          <FormControl isInvalid={errors.email}>
            <HStack data-group>
              <Icon
                as={MdOutlineEmail}
                variant="primary"
                position="absolute"
                left="0.5rem"
                fontSize={{ base: "20px", md: "24px", xl: "24px" }}
                opacity={!focused.email && "0.2"}
                _groupHover={{ opacity: 1 }}
                color={
                  focused.email && (colorMode === "dark" ? "p500" : "g500")
                }
              />
              <Input
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address.",
                  },
                })}
                onFocus={() => setFocused({ email: true })}
                onBlur={() => setFocused({ email: false })}
                name="email"
                autoComplete="off"
                placeholder={props.fsUser.user.email}
                variant="primary"
                paddingInline="2.25rem 1rem"
                marginInlineStart="0px !important"
                h="42px"
              />
              <ButtonGroup size="sm">
                <IconButton
                  icon={<MdCheck />}
                  type="submit"
                  isLoading={props.loadingUpdate.email ? true : false}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.email ? true : false}
                  onClick={() => setIsUpdating({ email: false })}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="r500"
                  _hover={{ color: "r500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
              </ButtonGroup>
            </HStack>
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <FormErrorMessage>{message}</FormErrorMessage>
              )}
            />
          </FormControl>
        </chakra.form>
      )}

      {/* Phone Number */}
      {!isUpdating.phone ? (
        <HStack>
          <Icon
            as={MdOutlinePhone}
            variant="primary"
            fontSize={{ base: "20px", md: "24px", xl: "24px" }}
          />
          <Text fontSize={{ base: "16px", md: "18px", xl: "18px" }}>
            {props.fsUser.user.phone_number
              ? props.fsUser.user.phone_number
              : "None"}
          </Text>
          {props.fsUser.user.phone_number ? (
            <Tooltip hasArrow label="Edit" variant="primary">
              <IconButton
                icon={
                  <MdOutlineEdit
                    fontSize={isSmallerThan768 ? "20px" : "24px"}
                  />
                }
                isLoading={props.loadingUpdate.phone ? true : false}
                isDisabled={
                  props.loadingUpdate.username ||
                  props.loadingUpdate.name ||
                  props.loadingUpdate.email
                }
                onClick={() => setIsUpdating({ phone: true })}
                variant="transparency"
                size={isSmallerThan768 ? "xs" : "sm"}
                marginInlineStart="0 !important"
                color={props.loadingUpdate.phone && "g500"}
              />
            </Tooltip>
          ) : undefined}
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() =>
            props.handlePhone(
              props.currentUser.uid,
              watch("phone"),
              setIsUpdating
            )
          )}
          display="flex"
        >
          <FormControl isInvalid={errors.phone}>
            <HStack data-group>
              <Icon
                as={RiFileUserLine}
                variant="primary"
                position="absolute"
                left="0.5rem"
                fontSize={{ base: "20px", md: "24px", xl: "24px" }}
                opacity={!focused.phone && "0.2"}
                _groupHover={{ opacity: 1 }}
                color={
                  focused.phone && (colorMode === "dark" ? "p500" : "g500")
                }
              />
              <Input
                {...register("phone", {
                  required: "Number is required.",
                })}
                onFocus={() => setFocused({ phone: true })}
                onBlur={() => setFocused({ phone: false })}
                name="phone"
                autoComplete="off"
                placeholder={props.fsUser.user.phone_number}
                variant="primary"
                paddingInline="2.25rem 1rem"
                marginInlineStart="0px !important"
                h="42px"
              />
              <ButtonGroup size="sm">
                <IconButton
                  icon={<MdCheck />}
                  type="submit"
                  isLoading={props.loadingUpdate.phone ? true : false}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.phone ? true : false}
                  onClick={() => setIsUpdating({ phone: false })}
                  variant="secondary"
                  size={isSmallerThan768 ? "xs" : "sm"}
                  color="r500"
                  _hover={{ color: "r500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
              </ButtonGroup>
            </HStack>
            <ErrorMessage
              errors={errors}
              name="phone"
              render={({ message }) => (
                <FormErrorMessage>{message}</FormErrorMessage>
              )}
            />
          </FormControl>
        </chakra.form>
      )}
    </>
  );
};

export default EditableFields;
