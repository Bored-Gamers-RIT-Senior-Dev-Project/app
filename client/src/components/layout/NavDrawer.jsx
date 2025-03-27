import {
    Box,
    Button,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const buildNavLinks = (user) => {
    const links = [
        {
            label: null,
            links: [
                { key: "homepage", text: "Home", path: "/" },
                { key: "schedule", text: "Schedule", path: "/schedule" },
                {
                    key: "search",
                    text: "Search Teams & Schools",
                    path: "/search",
                },
                { key: "about", text: 'About "A New World"', path: "/about" },
                { key: "rules", text: "Rules", path: "/rules" },
                // { key: "faq", text: "FAQ", path: "/faq" },
            ],
        },
    ];
    if (!user) return links;

    const { roleId, universityName, universityId, teamName, teamId } = user;
    switch (roleId) {
        case 2: //Super Admin role
        case 3: //AG Employee role
            links.push({
                label: "Admin",
                links: [
                    { key: "adminDash", text: "Dashboard", path: "/admin" },
                    {
                        key: "adminReports",
                        text: "Reports View",
                        path: "/admin/reports",
                    },
                    {
                        key: "adminUserManager",
                        text: "User Manager",
                        path: "/admin/users",
                    },
                ],
            });
            break;
        case 4: //"Marketing Staff" Role
        case 8: //College Admin role
            links.push({
                label: universityName ?? "University Representative",
                links: [
                    {
                        key: "repDashboard",
                        text: "Dashboard",
                        path: "/representative",
                    },
                    {
                        key: "uniPage",
                        text: "University Page",
                        path: `/university/${universityId ?? 1}`,
                    },
                ],
            });
            break;
        case 6: //Team Captain role
        case 7: //Student/Participant Role
            links.push({
                label: "Participant",
                links: [
                    {
                        key: "myTeam",
                        text: teamName ?? "My Team",
                        path: `/teams/${teamId ?? 1}`,
                    },
                    {
                        key: "teamSchedule",
                        text: "Team Schedule",
                        path: `/schedule?team=${teamId ?? 1}`,
                    },
                ],
            });
            break;
    }
    return links;
};

const ListSection = ({ label, links, navigate, index }) => (
    <>
        {label && <Divider key={`label_${index}`}>{label}</Divider>}
        {links.map(({ key, text, path }) => (
            <ListItem key={key} onClick={() => navigate(path)}>
                <ListItemButton>
                    <ListItemText primary={text} />
                </ListItemButton>
            </ListItem>
        ))}
    </>
);

ListSection.propTypes = {
    index: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string,
    links: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
        })
    ).isRequired,
    navigate: PropTypes.func.isRequired,
};

const NavDrawer = ({ open, setOpen, desktop }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const navLinks = useMemo(() => buildNavLinks(user), [user]);

    //When the location changes, close the drawer on mobile.
    useEffect(() => {
        if (!desktop) setOpen(false);
    }, [location, setOpen, desktop]);

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            elevation={8}
            // hideBackdrop={desktop}
            variant={desktop ? "persistent" : "temporary"}
        >
            {/* Placeholder Toolbar prevents NavDrawer content from being covered by the actual navbar */}
            <Toolbar />
            <Box px={2}>
                <List>
                    {navLinks.map(({ label, links }, index) => (
                        <ListSection
                            key={index}
                            index={index}
                            label={label}
                            links={links}
                            navigate={navigate}
                        />
                    ))}
                </List>
            </Box>
            {user && user.roleId == 1 && (
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ marginX: "2em" }}
                    onClick={() => navigate("/join")}
                >
                    Join The
                    <br />
                    Competition!
                </Button>
            )}
        </Drawer>
    );
};

NavDrawer.propTypes = {
    desktop: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export { NavDrawer };
