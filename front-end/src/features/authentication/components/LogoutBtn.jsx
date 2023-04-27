// *Design Imports*
import { Button, useToast } from "@chakra-ui/react";

// *API Services Import*
import PostLogout from "../api_services/PostLogout";

const LogoutBtn = (props) => {
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
        {...props}
      >
        Logout
      </Button>
    </>
  );
};

export default LogoutBtn;
