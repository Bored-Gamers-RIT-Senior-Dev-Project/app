import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Card,
    Grid2 as Grid,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

import { usePostSubmit } from "../../hooks/usePostSubmit";
import propTypes from "../../utils/propTypes";

const MemberList = ({ members, captainId, teamId, currentUser = {} }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const submit = usePostSubmit();

    const handleMenuOpen = (event, member) => {
        setMenuAnchor(event.currentTarget);
        setSelectedMember(member);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedMember(null);
    };

    const UserMenu = useCallback(
        ({ member }) => {
            if (currentUser.userId == captainId) {
                return (
                    <Menu
                        anchorEl={menuAnchor}
                        open={
                            Boolean(menuAnchor) &&
                            selectedMember?.userId === member.userId
                        }
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={() => {
                                submit(
                                    {
                                        id: member.userId,
                                    },
                                    { action: "./remove", navigate: false }
                                );
                                handleMenuClose();
                            }}
                        >
                            Remove From Team
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                submit(
                                    { id: member.userId },
                                    { action: "./promote", navigate: false }
                                );
                                handleMenuClose();
                            }}
                        >
                            Promote To Captain
                        </MenuItem>
                    </Menu>
                );
            }
            return (
                <Menu
                    anchorEl={menuAnchor}
                    open={
                        Boolean(menuAnchor) &&
                        selectedMember?.userId === member.userId
                    }
                    onClose={handleMenuClose}
                >
                    <MenuItem
                        onClick={() => {
                            submit(
                                { id: member.userId },
                                { action: "./remove", navigate: false }
                            );
                            handleMenuClose();
                        }}
                    >
                        Leave Team
                    </MenuItem>
                </Menu>
            );
        },
        [
            captainId,
            currentUser.userId,
            menuAnchor,
            selectedMember?.userId,
            submit,
        ]
    );
    return (
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
                        {!member.isValidated ? (
                            //Courtesy of copilot
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                title="This member is not verified"
                            >
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{ mr: 1 }}
                                >
                                    Unverified
                                </Typography>
                            </Box>
                        ) : !member.paid && currentUser.teamId == teamId ? (
                            //Courtesy of copilot
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                title="This member has not paid their 5$ participation fee."
                            >
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{ mr: 1 }}
                                >
                                    Participation Fee Outstanding
                                </Typography>
                            </Box>
                        ) : null}
                        {member.userId != captainId &&
                            (currentUser.userId == captainId ||
                                member.userId == currentUser.userId) && (
                                <IconButton
                                    onClick={(e) => handleMenuOpen(e, member)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            )}
                        <UserMenu member={member} />
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

MemberList.propTypes = {
    members: propTypes.array,
    captainId: propTypes.number,
    currentUser: propTypes.object,
};

export { MemberList };
