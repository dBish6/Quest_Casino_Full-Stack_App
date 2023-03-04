// *Design Imports*
import {
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";

// *API Services Import*
import PostLogout from "../../api_services/PostLogout";

const LogoutBtn = () => {
  const [handleLogout, unexpectedErr] = PostLogout();

  return (
    <>
      <Button
        onClick={() => handleLogout()}
        variant="primary"
        justifySelf="center"
        w="100%"
        maxW="243px"
      >
        Logout
      </Button>
      {/* FIXME: CHANGE to toast in function. */}
      {unexpectedErr.length ? (
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          <Box>
            <AlertTitle>Server Error 500</AlertTitle>
            <AlertDescription>{unexpectedErr}</AlertDescription>
          </Box>
        </Alert>
      ) : undefined}
    </>
  );
};

export default LogoutBtn;
