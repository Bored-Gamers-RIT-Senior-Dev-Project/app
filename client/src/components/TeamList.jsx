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

const TeamList = ({ university, teams }) => {
    const submit = usePostSubmit();
    const [newTeamName, setNewTeamName] = useState("");
    const [error, setError] = useState("");

    const handleFormNewTeam = () => {
        submit(
            { universityId: university, teamName: newTeamName },
            { action: "/join/newTeam" }
        );
    };

    const filteredTeams = useMemo(
        () => teams.filter((team) => team.universityId == university),
        [teams, university]
    );

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: "100%" }}>
                    <CardHeader
                        title="New Team"
                        subheader="Create a new team and invite your friends!"
                    />
                    <CardContent>
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
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button variant="contained" onClick={handleFormNewTeam}>
                            Create Team
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            {filteredTeams.map((team) => (
                <TeamElement key={team.id} team={team} />
            ))}
        </Grid>
    );
};
TeamList.propTypes = {
    university: propTypes.number,
    teams: propTypes.array.isRequired,
};

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

const TeamElement = ({ team }) => {
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
                            src={team.profileImageUrl}
                            sx={{ height: "2em", width: "2em" }}
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
                <CardContent sx={{ flexGrow: "1" }}>
                    {team.description}
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button variant="contained" disabled={team.members >= 7}>
                        Join
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};
TeamElement.propTypes = {
    team: propTypes.object.isRequired,
};

export { TeamList };
