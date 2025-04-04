import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Save as SaveIcon,
    Upload as UploadIcon,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Card,
    Grid2 as Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

const TeamEditor = ({
    teamName,
    setTeamName,
    teamSummary,
    setTeamSummary,
    members,
    setMembers,
    tab,
    setTab,
    exitEditMode,
}) => {
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
        setMembers(members.filter((m) => m.id !== selectedMember.id));
        handleMenuClose();
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: { xs: 2, md: 4 },
            }}
        >
            <Paper
                sx={{
                    padding: { xs: 2, md: 4 },
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "auto",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <TextField
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        variant="outlined"
                        autoFocus
                        fullWidth
                    />
                    <IconButton onClick={exitEditMode}>
                        <SaveIcon sx={{ color: "blue" }} />
                    </IconButton>
                </Box>

                <Paper
                    sx={{
                        padding: 2,
                        textAlign: "center",
                        width: "100%",
                        mb: 2,
                    }}
                >
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<UploadIcon />}
                    >
                        Upload Team Image
                        <input type="file" hidden />
                    </Button>
                    <Box
                        sx={{
                            height: "200px",
                            backgroundColor: "#e0e0e0",
                            marginTop: 2,
                            borderRadius: "10px",
                            width: "100%",
                        }}
                    >
                        Team Image Placeholder
                    </Box>
                </Paper>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={teamSummary}
                        onChange={(e) => setTeamSummary(e.target.value)}
                        variant="outlined"
                    />
                </Box>

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
                            <Grid size={12} key={member.id}>
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
                                    >
                                        U
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6">
                                            {member.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            {member.role}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontStyle: "italic" }}
                                        >
                                            {member.blurb}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        onClick={(e) =>
                                            handleMenuOpen(e, member)
                                        }
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
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            setMembers([
                                ...members,
                                {
                                    id: members.length + 1,
                                    name: "New Member",
                                    role: "Role",
                                    blurb: "Description...",
                                },
                            ])
                        }
                    >
                        Add Member
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

//Credit for proptypes: Copilot generation
TeamEditor.propTypes = {
    teamName: PropTypes.string.isRequired,
    setTeamName: PropTypes.func.isRequired,
    teamSummary: PropTypes.string.isRequired,
    setTeamSummary: PropTypes.func.isRequired,
    members: PropTypes.array.isRequired,
    setMembers: PropTypes.func.isRequired,
    tab: PropTypes.number.isRequired,
    setTab: PropTypes.func.isRequired,
    exitEditMode: PropTypes.func.isRequired,
};

export { TeamEditor };
