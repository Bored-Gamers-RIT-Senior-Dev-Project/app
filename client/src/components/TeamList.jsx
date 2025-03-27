import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Grid2 as Grid,
    TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { usePostSubmit } from "../hooks/usePostSubmit";
import propTypes from "../utils/propTypes";
import { Colors } from "../utils/theme";

const getChipColor = (count) => {
    switch (count) {
        case 0:
        case 1:
        case 2:
        case 3:
            return Colors.game.lightGreen;
        case 4:
        case 5:
        case 6:
            return Colors.game.darkGreen;
        case 7:
        default:
            return Colors.game.purple;
    }
};

const TeamElement = ({ team, onSubmit }) => {
    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            alt={team.teamName}
                            src={team.profileImageUrl}
                            sx={{ height: "3em", width: "3em" }}
                        />
                    }
                    action={
                        <Chip
                            label={`Members: ${team.members}/7`}
                            sx={{
                                backgroundColor: getChipColor(team.members),
                                color: team.members > 3 ? "white" : "black",
                            }}
                        />
                    }
                    title={team.teamName}
                    subheader={`Captain: ${team.captainName}`}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    {team.description}
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        disabled={team.members >= 7}
                        onClick={() => onSubmit(team.id)}
                    >
                        Join
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};
TeamElement.propTypes = {
    team: propTypes.object.isRequired,
    onSubmit: propTypes.func.isRequired,
};

const CreateTeamElement = ({ onSubmit }) => {
    const [error, setError] = useState("");
    const [newTeamName, setNewTeamName] = useState("");

    const validateTeamName = () => {
        //I wrote the regex and changed it, but I basically told copilot to give me a check for the regex provided and it
        const regex = /^[^\w ]/;
        if (newTeamName.trim().length < 1) {
            setError("Team name cannot be empty.");
        }
        if (regex.test(newTeamName)) {
            setError(
                "Team name can only include letters, numbers, and spaces."
            );
            return false;
        }
        return true;
    };

    const handleButtonClick = () => {
        if (validateTeamName()) {
            onSubmit(newTeamName);
        }
    };

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardHeader
                    title="New Team"
                    subheader="Create a new team and invite your friends!"
                />
                <CardContent sx={{ flexGrow: "1" }}>
                    <TextField
                        fullWidth
                        label="Team name"
                        value={newTeamName}
                        onChange={(event) => {
                            setError(null);
                            setNewTeamName(event.target.value);
                        }}
                        error={error}
                        helperText={error}
                    />
                </CardContent>
                <CardActions
                    sx={{
                        justifyContent: "flex-end",
                    }}
                >
                    <Button variant="contained" onClick={handleButtonClick}>
                        Create Team
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

CreateTeamElement.propTypes = {
    onSubmit: propTypes.func.isRequired,
};

const TeamList = ({ university, teams }) => {
    const submit = usePostSubmit();

    /**
     * Handles what happens when the user clicks the "Create team" button and the content of the Team Name field is valid
     * @param {string} newTeamName Contents of the Team name field
     */
    const handleFormNewTeam = (newTeamName) => {
        submit(
            { universityId: university, teamName: newTeamName },
            { action: "/join/newTeam" }
        );
    };

    /**
     * Handle what happens when the user clicks "join" on a team item
     * @param {number} teamId The ID of the team the user clicked to join
     */
    const handleJoinTeam = (teamId) => {
        submit({ teamId });
    };

    const filteredTeams = useMemo(
        () => teams.filter((team) => team.universityId == university),
        [teams, university]
    );

    return (
        <Grid container spacing={2}>
            <CreateTeamElement onSubmit={handleFormNewTeam} />
            {filteredTeams.map((team) => (
                <TeamElement
                    key={team.id}
                    team={team}
                    onSubmit={handleJoinTeam}
                />
            ))}
        </Grid>
    );
};
TeamList.propTypes = {
    university: propTypes.number,
    teams: propTypes.array.isRequired,
};

export { TeamList };
