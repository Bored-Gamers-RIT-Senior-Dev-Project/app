import { AccountCircle } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "../../utils/firebase/auth";
import PropTypes from "../../utils/propTypes";

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
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);

    const toggleOpen = (event) => {
        setAnchor(!open ? event.currentTarget : null);
    };

    const closeMenu = () => setAnchor(null);

    return (
        <>
            <Button
                id="mobile-account-icon"
                sx={{ margin: "2%" }}
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={toggleOpen}
            >
                <Avatar
                    src={user.profileImageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    sx={{ height: "96%" }}
                />
            </Button>
            <Menu
                open={open}
                onClose={closeMenu}
                anchorEl={anchor}
                closeAfterTransition
            >
                <MenuItem
                    onClick={() =>
                        closeMenu() || navigate("./user_preferences")
                    }
                >
                    User Settings
                </MenuItem>
                <MenuItem
                    onClick={() => closeMenu() || signOut().then(() => true)}
                >
                    Log Out
                </MenuItem>
            </Menu>
        </>
    );
};

//Base layout created with help from https://chatgpt.com/canvas/shared/67b25013bf248191b31480e87422cb43 to save time
const DesktopAccountIcon = ({ navigate, user }) => {
    const [anchor, setAnchor] = useState(null);
    const open = Boolean(anchor);

    const toggleOpen = (event) => {
        setAnchor(!open ? event.currentTarget : null);
    };

    const closeMenu = () => setAnchor(null);

    return (
        <>
            <ButtonBase
                variant="outlined"
                sx={{
                    display: "flex",
                    alignItems: "left",
                    border: "2px solid white",
                    paddingLeft: "1em",
                    margin: "0.5em",

                    borderRadius: "4em",
                    ":hover": {
                        background: "rgba(255,255,255,0.1)",
                    },
                }}
                onClick={toggleOpen}
            >
                <Box>
                    <Typography variant="h6" sx={{ color: "white" }}>
                        {user.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {user.firstName} {user.lastName}
                    </Typography>
                </Box>
                <Avatar
                    src={user.profileImageUrl}
                    alt={user.username}
                    sx={{
                        width: 56,
                        height: 56,
                        marginLeft: 2,
                        float: "right",
                    }}
                />
            </ButtonBase>
            <Menu
                open={open}
                onClose={closeMenu}
                anchorEl={anchor}
                closeAfterTransition
            >
                <MenuItem
                    onClick={() =>
                        closeMenu() || navigate("./user_preferences")
                    }
                >
                    User Settings
                </MenuItem>
                <MenuItem
                    onClick={() => closeMenu() || signOut().then(() => true)}
                >
                    Log Out
                </MenuItem>
            </Menu>
        </>
    );
};

const AccountIcon = ({ desktop }) => {
    const navigate = useNavigate();
    const user = useAuth(); // TODO: Replace with actual user state

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

MobileAccountIcon.propTypes = {
    navigate: PropTypes.func.isRequired,
    user: PropTypes.User,
};
DesktopAccountIcon.propTypes = {
    navigate: PropTypes.func.isRequired,
    user: PropTypes.User,
};

AccountIcon.propTypes = {
    desktop: PropTypes.bool.isRequired,
};

LogInButton.propTypes = {
    navigate: PropTypes.func.isRequired,
    desktop: PropTypes.bool.isRequired,
};

export { AccountIcon };
