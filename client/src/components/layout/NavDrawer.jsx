import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useNavigate } from "react-router";

const nav_links = [
  { key: "homepage", text: "Home", path: "/" },
  { key: "schedule", text: "Schedule", path: "/schedule" },
  { key: "search", text: "Search Teams & Schools", path: "/search" },
  { key: "about", text: 'About "A New World"', path: "/about" },
  { key: "rules", text: "Rules", path: "/rules" },
  { key: "faq", text: "FAQ", path: "/faq" },
];

const admin_links = [
  { key: "adminDash", text: "Dashboard", path: "/admin" },
  { key: "adminReports", text: "Reports View", path: "/admin/reports" },
  { key: "adminUserManager", text: "User Manager", path: "/admin/users" },
];

const participant_links = [
  { key: "myTeam", text: "My Team", path: "/teams/1" },
  { key: "teamSchedule", text: "Team Schedule", path: "/schedule?team=1" },
];

const university_links = [
  { key: "repDashboard", text: "Dashboard", path: "/representative" },
  { key: "uniPage", text: "University Page", path: "/university/1" },
];

const NavDrawer = ({ open, onClose }) => {
  const desktop = useMediaQuery((theme) => theme.breakpoints.up("lg")); // Transition from desktop (permanent drawer) to mobile (temporary drawer) when screen width is less than the large breakpoint.
  const navigate = useNavigate();

  const NavDrawerItem = useCallback(
    ({ key, text, path }) => (
      <ListItem key={key} onClick={() => navigate(path)}>
        <ListItemButton>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    ),
    [navigate]
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={desktop ? "permanent" : "temporary"}
      elevation={8}
    >
      {/* Placeholder Toolbar prevents NavDrawer content from being covered by the actual navbar */}
      <Toolbar />
      <Box height={"100%"} px={2}>
        <List>
          {nav_links.map(({ key, ...link }) => (
            <NavDrawerItem key={key} {...link} />
          ))}
          <Divider>Admin</Divider>
          {admin_links.map(({ key, ...link }) => (
            <NavDrawerItem key={key} {...link} />
          ))}
        </List>
        <Divider>TEAM NAME</Divider>
        {participant_links.map(({ key, ...link }) => (
          <NavDrawerItem key={key} {...link} />
        ))}
        <Divider>University Representative</Divider>
        {university_links.map(({ key, ...link }) => (
          <NavDrawerItem key={key} {...link} />
        ))}
      </Box>
    </Drawer>
  );
};

NavDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { NavDrawer };
