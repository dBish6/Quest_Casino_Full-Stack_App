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
      <Button onClick={() => handleLogout()}>Logout</Button>
      {unexpectedErr.length ? (
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          <Box>
            <AlertTitle>Server Error</AlertTitle>
            <AlertDescription>{unexpectedErr}</AlertDescription>
          </Box>
        </Alert>
      ) : undefined}
    </>
  );
};

export default LogoutBtn;
