// *Design Imports*
import { Button, useToast } from "@chakra-ui/react";

// *API Services Import*
import PostLogout from "../api_services/PostLogout";

const LogoutBtn = () => {
  const [handleLogout, unexpectedErr] = PostLogout();
  const toast = useToast();

  return (
    <>
      {unexpectedErr.length
        ? toast({
            description: "Server Error 500 " + unexpectedErr,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          })
        : undefined}

      <Button
        onClick={() => handleLogout()}
        variant="primary"
        justifySelf="center"
        w="100%"
        maxW="243px"
      >
        Logout
      </Button>
    </>
  );
};

export default LogoutBtn;
