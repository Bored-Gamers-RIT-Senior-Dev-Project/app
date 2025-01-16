import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
const AccountIcon = () => {
  //TODO: If user is logged in, display their profile picture and change the menu.
  const [anchor, setAnchor] = useState(null);
  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setAnchor(null);
  };

  const navigate = useNavigate();
  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  return (
    <>
      <Menu
        id="account-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleNavigate("/login")}>Log In</MenuItem>
        <MenuItem onClick={() => handleNavigate("/register")}>
          Register
        </MenuItem>
      </Menu>
      <IconButton edge="end" color="inherit" onClick={handleClick}>
        <AccountCircle />
      </IconButton>
    </>
  );
};

export { AccountIcon };
