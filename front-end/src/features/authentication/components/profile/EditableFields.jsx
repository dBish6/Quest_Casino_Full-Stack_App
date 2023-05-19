import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Design Imports*
import {
  IconButton,
  ButtonGroup,
  HStack,
  Icon,
  Text,
  Input,
  Select,
  FormControl,
  FormErrorMessage,
  chakra,
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

// *Custom Hooks Import*
import usePhoneFormat from "../../hooks/usePhoneFormat";

// *Utility Import*
import COUNTRIES from "../../utils/COUNTRIES";

// *Component Import*
import MyTooltip from "../../../../components/MyTooltip";

const EditableFields = (props) => {
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
  const { handlePhoneFormat, inputValue, handlePhoneErrorMsg, errorMsg } =
    usePhoneFormat();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      callingCode: "",
      phone: "",
    },
  });

  return (
    <>
      {/* Full Name */}
      {!isUpdating.name ? (
        <HStack>
          <Icon as={RiFileUserLine} variant="primary" fontSize="24px" />
          <Text fontSize="18px">{props.fsUser.full_name}</Text>
          <MyTooltip label="Edit">
            <IconButton
              icon={<MdOutlineEdit fontSize="24px" />}
              aria-label="edit"
              isLoading={props.loadingUpdate.name ? true : false}
              isDisabled={
                props.loadingUpdate.username ||
                props.loadingUpdate.email ||
                props.loadingUpdate.phone
              }
              onClick={() => setIsUpdating({ ...isUpdating, name: true })}
              variant="transparency"
              size="sm"
              marginInlineStart="0 !important"
              color={props.loadingUpdate.name && "g500"}
            />
          </MyTooltip>
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() => {
            if (!watch("name").includes(" ")) {
              setError("name", {
                type: "custom",
                message: "Must be a full name.",
              });
            } else {
              setError("name", false);
              props.handleFullName(watch("name"), setIsUpdating);
            }
          })}
          display="flex"
        >
          <FormControl isInvalid={errors.name}>
            <HStack data-group>
              <Icon
                as={RiFileUserLine}
                variant="primary"
                position="absolute"
                left="0.5rem"
                fontSize="24px"
                opacity={!focused.name && "0.2"}
                _groupHover={{ opacity: 1 }}
                color={focused.name && (colorMode === "dark" ? "p500" : "g500")}
              />
              <Input
                {...register("name", {
                  required: "Name is required.",
                })}
                onFocus={() => setFocused({ ...focused, name: true })}
                onBlur={() => setFocused({ ...focused, name: false })}
                id="name"
                name="name"
                autoComplete="off"
                placeholder={props.fsUser.full_name}
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
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.name ? true : false}
                  onClick={() => setIsUpdating({ ...isUpdating, name: false })}
                  variant="secondary"
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
          <Icon as={RiUser3Line} variant="primary" fontSize="24px" />
          <Text fontSize="18px">{props.fsUser.username}</Text>
          <MyTooltip label="Edit">
            <IconButton
              icon={<MdOutlineEdit fontSize="24px" />}
              aria-label="edit"
              isLoading={props.loadingUpdate.username ? true : false}
              isDisabled={
                props.loadingUpdate.name ||
                props.loadingUpdate.email ||
                props.loadingUpdate.phone
              }
              onClick={() => setIsUpdating({ ...isUpdating, username: true })}
              variant="transparency"
              size="sm"
              marginInlineStart="0 !important"
              color={props.loadingUpdate.username && "g500"}
            />
          </MyTooltip>
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() =>
            props.handleUsername(watch("username"), setIsUpdating)
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
                fontSize="24px"
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
                onFocus={() => setFocused({ ...focused, username: true })}
                onBlur={() => setFocused({ ...focused, username: false })}
                id="username"
                name="username"
                autoComplete="off"
                placeholder={props.fsUser.username}
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
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.username ? true : false}
                  onClick={() =>
                    setIsUpdating({ ...isUpdating, username: false })
                  }
                  variant="secondary"
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
          <Icon as={MdOutlineEmail} variant="primary" fontSize="24px" />
          <Text fontSize="18px">{props.fsUser.email}</Text>
          <MyTooltip label="Edit">
            <IconButton
              icon={<MdOutlineEdit fontSize="24px" />}
              aria-label="edit"
              isLoading={props.loadingUpdate.email ? true : false}
              isDisabled={
                props.loadingUpdate.username ||
                props.loadingUpdate.name ||
                props.loadingUpdate.phone
              }
              onClick={() => setIsUpdating({ ...isUpdating, email: true })}
              variant="transparency"
              size="sm"
              marginInlineStart="0 !important"
              color={props.loadingUpdate.email && "g500"}
            />
          </MyTooltip>
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() =>
            props.handleEmail(watch("email"), setIsUpdating)
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
                fontSize="24px"
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
                onFocus={() => setFocused({ ...focused, email: true })}
                onBlur={() => setFocused({ ...focused, email: false })}
                id="email"
                name="email"
                autoComplete="off"
                placeholder={props.fsUser.email}
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
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.email ? true : false}
                  onClick={() => setIsUpdating({ ...isUpdating, email: false })}
                  variant="secondary"
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
          <Icon as={MdOutlinePhone} variant="primary" fontSize="24px" />
          <Text fontSize="18px">
            {props.fsUser.phone_number ? props.fsUser.phone_number : "None"}
          </Text>
          <MyTooltip label="Edit">
            <IconButton
              icon={<MdOutlineEdit fontSize="24px" />}
              aria-label="edit"
              isLoading={props.loadingUpdate.phone ? true : false}
              isDisabled={
                props.loadingUpdate.username ||
                props.loadingUpdate.name ||
                props.loadingUpdate.email
              }
              onClick={() => setIsUpdating({ ...isUpdating, phone: true })}
              variant="transparency"
              size="sm"
              marginInlineStart="0 !important"
              color={props.loadingUpdate.phone && "g500"}
            />
          </MyTooltip>
        </HStack>
      ) : (
        <chakra.form
          onSubmit={handleSubmit(() =>
            props.handlePhone(
              watch("callingCode"),
              watch("phone"),
              setIsUpdating
            )
          )}
          display="flex"
        >
          <FormControl isInvalid={errors.phone || errorMsg}>
            <HStack data-group>
              <Select
                {...register("callingCode", {
                  required: true,
                })}
                onFocus={() => setFocused({ ...focused, phone: true })}
                onBlur={() => setFocused({ ...focused, phone: false })}
                id="callingCode"
                name="callingCode"
                variant="primary"
                maxW="110px"
                borderRightRadius="0"
                h="42px"
              >
                {COUNTRIES.map((detail, i) => (
                  <option key={i} value={detail.callingCode}>
                    {detail.code}: {detail.callingCode}
                  </option>
                ))}
              </Select>
              <Icon
                as={RiFileUserLine}
                variant="primary"
                position="absolute"
                left="calc(0.5rem + 100px)"
                fontSize="24px"
                opacity={!focused.phone && "0.2"}
                _groupHover={{ opacity: 1 }}
                color={
                  focused.phone && (colorMode === "dark" ? "p500" : "g500")
                }
              />
              <Input
                {...register("phone", {
                  required: "Number is required.",
                  minLength: {
                    value: 14,
                    message: "Must be at least 10 digits long.",
                  },
                  onChange: (e) => {
                    handlePhoneFormat(e);
                    handlePhoneErrorMsg(e);
                  },
                })}
                onFocus={() => setFocused({ ...focused, phone: true })}
                onBlur={() => setFocused({ ...focused, phone: false })}
                value={inputValue}
                id="phone"
                name="phone"
                maxLength="14"
                autoComplete="off"
                placeholder={props.fsUser.phone_number}
                variant="primary"
                paddingInline="2.25rem 1rem"
                marginInlineStart="0px !important"
                h="42px"
                maxW="175px"
              />
              <ButtonGroup size="sm">
                <IconButton
                  icon={<MdCheck />}
                  type="submit"
                  isLoading={props.loadingUpdate.phone ? true : false}
                  variant="secondary"
                  color="g500"
                  _hover={{ color: "g500" }}
                  _active={{ bgColor: "rgb(244, 244, 244, 0.2)" }}
                />
                <IconButton
                  icon={<MdClose />}
                  isDisabled={props.loadingUpdate.phone ? true : false}
                  onClick={() => setIsUpdating({ ...isUpdating, phone: false })}
                  variant="secondary"
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
            {errorMsg.length ? (
              <FormErrorMessage>{errorMsg}</FormErrorMessage>
            ) : undefined}
          </FormControl>
        </chakra.form>
      )}
    </>
  );
};

export default EditableFields;
