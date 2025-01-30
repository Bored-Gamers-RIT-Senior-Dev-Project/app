import { AccountCircle } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router";

const LogInButton = ({ navigate, desktop }) => {
  return (
    <Button
      size={desktop ? "large" : "small"}
      variant="contained"
      color="secondary"
      onClick={() => navigate("/signin")}
      endIcon={desktop ? <AccountCircle /> : null}
    >
      Sign In
    </Button>
  );
};

const MobileAccountIcon = ({ navigate, user }) => {
  if (!user) {
    return (
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={() => navigate("/signin")}
      >
        Sign In
      </Button>
    );
  }
};

const DesktopAccountIcon = ({ navigate, user }) => {
  if (!user) {
    return (
      <Button
        size="large"
        variant="contained"
        color="secondary"
        onClick={() => navigate("/signin")}
      >
        Sign In
      </Button>
    );
  }

  //TODO: if user is logged in, display their profile picture and name here.
};

const AccountIcon = ({ desktop }) => {
  const navigate = useNavigate();
  const user = false; // TODO: Replace with actual user state

  return (
    <Box sx={{ position: "absolute", right: { lg: 25, xs: 10 } }}>
      {!user ? (
        <LogInButton navigate={navigate} desktop={desktop} />
      ) : desktop ? (
        <DesktopAccountIcon navigate={navigate} user={user} />
      ) : (
        <MobileAccountIcon navigate={navigate} user={user} />
      )}
    </Box>
  );
};

export { AccountIcon };
