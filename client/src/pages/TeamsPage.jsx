//Source: chatgpt
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveIcon from "@mui/icons-material/Save";
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
import { useState } from "react";
import { useLoaderData } from "react-router";

const TeamsPage = () => {
    const team = useLoaderData();
    const [editMode, setEditMode] = useState(false);
    const [teamName, setTeamName] = useState(team.teamName);
    const [teamSummary, setTeamSummary] = useState(team.description ?? "");
    const [members, setMembers] = useState([
        {
            id: 1,
            name: "User Name",
            role: "Member",
            blurb: "Lorem ipsum dolor asdf this is a user blurb.",
        },
        {
            id: 2,
            name: "User Name",
            role: "Scientist",
            blurb: "Fourth-year student studying engineering. Member of the e-sports team.",
        },
        {
            id: 3,
            name: "User Name",
            role: "Writer",
            blurb: "Third-year student double-majoring Creative Writing and Theater.",
        },
    ]);
    const [tab, setTab] = useState(0);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const toggleEditMode = () => setEditMode(!editMode);

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
                    maxWidth: {
                        xs: "100%",
                        sm: "90%",
                        md: "1100px",
                        lg: "1200px",
                    },
                    margin: "auto",
                }}
            >
                {/* Team Name + Edit Button */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    {editMode ? (
                        <TextField
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            variant="outlined"
                            autoFocus
                            fullWidth
                        />
                    ) : (
                        <Typography variant="h4">{teamName}</Typography>
                    )}
                    <IconButton onClick={toggleEditMode}>
                        {editMode ? (
                            <SaveIcon sx={{ color: "blue" }} />
                        ) : (
                            <EditIcon sx={{ color: "blue" }} />
                        )}
                    </IconButton>
                </Box>

                {/* Team Image Upload (Only in Edit Mode) */}
                {editMode && (
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
                )}

                {/* Team Summary */}
                <Box sx={{ mb: 2 }}>
                    {editMode ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={teamSummary}
                            onChange={(e) => setTeamSummary(e.target.value)}
                            variant="outlined"
                        />
                    ) : (
                        <Typography variant="body1">{teamSummary}</Typography>
                    )}
                </Box>

                {/* Tabs for Members / Events */}
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label="Members" />
                    <Tab label="Events" />
                </Tabs>

                {/* Members Section */}
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

                                    {/* Edit Mode - Dropdown Menu */}
                                    {editMode && (
                                        <IconButton
                                            onClick={(e) =>
                                                handleMenuOpen(e, member)
                                            }
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Dropdown Menu for Members */}
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

                {/* Floating Add Member Button */}
                {editMode && (
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
                )}
            </Paper>
        </Box>
    );
};

export { TeamsPage };
