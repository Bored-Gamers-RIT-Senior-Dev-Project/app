import { Edit as EditIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Card,
    Grid2 as Grid,
    IconButton,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const TeamView = ({
    teamName,
    teamSummary,
    members,
    tab,
    setTab,
    enterEditMode,
}) => {
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
                    <Typography variant="h4">{teamName}</Typography>
                    <IconButton onClick={enterEditMode}>
                        <EditIcon sx={{ color: "blue" }} />
                    </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">{teamSummary}</Typography>
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
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

//Credit for proptypes: Copilot generation
TeamView.propTypes = {
    teamName: PropTypes.string.isRequired,
    teamSummary: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    tab: PropTypes.number.isRequired,
    setTab: PropTypes.func.isRequired,
    enterEditMode: PropTypes.func.isRequired,
};

export { TeamView };
