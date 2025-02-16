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
                    src={user.ProfileImageURL}
                    alt={`${user.FirstName} ${user.LastName}`}
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
            {!user.Username ? (
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
    user: PropTypes.shape({
        ProfileImageURL: PropTypes.string,
        FirstName: PropTypes.string,
        LastName: PropTypes.string,
    }).isRequired,
};

AccountIcon.propTypes = {
    desktop: PropTypes.bool.isRequired,
};

LogInButton.propTypes = {
    navigate: PropTypes.func.isRequired,
    desktop: PropTypes.bool.isRequired,
};

export { AccountIcon };
