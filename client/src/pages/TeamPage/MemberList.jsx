import { Add as AddIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Card,
    Grid2 as Grid,
    IconButton,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { useState } from "react";
import propTypes from "../../utils/propTypes";
const MemberList = ({ members, captainId }) => {
    const [tab, setTab] = useState(0);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const handleMenuOpen = (event, member) => {
        setMenuAnchor(event.currentTarget);
        setSelectedMember(member);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedMember(null);
    };

    const handleRemoveMember = () => {
        console.log("Remove ", selectedMember);
        handleMenuClose();
    };
    return (
        <Box>
            <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                <Tab label="Members" />
                <Tab label="Events" />
            </Tabs>

            {tab === 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {members.map((member) => (
                        <Grid size={12} key={member.userId}>
                            <Card
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: 2,
                                    position: "relative",
                                }}
                            >
                                <Avatar
                                    sx={{ width: 50, height: 50, mr: 2 }}
                                    alt={`${member.firstName} ${member.lastName}`}
                                    src={member.profileImageUrl}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">
                                        {member.firstName} {member.lastName}
                                    </Typography>
                                    <Typography variant="body2">
                                        {member.userId == captainId
                                            ? "Captain"
                                            : "Member"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontStyle: "italic" }}
                                    >
                                        {member.bio}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={(e) => handleMenuOpen(e, member)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleRemoveMember}>Remove</MenuItem>
                <MenuItem onClick={() => alert("Change Role clicked!")}>
                    Change Role
                </MenuItem>
            </Menu>

            <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Add Member
                </Button>
            </Box>
        </Box>
    );
};

MemberList.propTypes = {
    members: propTypes.array,
    captainId: propTypes.number,
};

export { MemberList };
