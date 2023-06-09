// *Design Imports*
import { Button } from "@chakra-ui/react";

// *API Services Import*
import PostLogout from "../api_services/PostLogout";

const LogoutBtn = (props) => {
  const [handleUserLogout, loading] = PostLogout();

  return (
    <Button
      onClick={() => handleUserLogout(true)}
      isLoading={loading}
      aria-disabled={loading}
      variant="primary"
      justifySelf="center"
      {...props}
    >
      Logout
    </Button>
  );
};

export default LogoutBtn;
