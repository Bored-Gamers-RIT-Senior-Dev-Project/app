import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router";
const AccountIcon = () => {
  //TODO: If user is logged in, display their profile picture and change the menu.
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/signin")}
      >
        Sign In
      </Button>
    </Box>
  );
};

export { AccountIcon };
