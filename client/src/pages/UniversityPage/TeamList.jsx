import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { InfoElement } from "../../components/InfoElement";
import propTypes from "../../utils/propTypes";

const TeamList = ({ teams }) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ px: 2, width: "100%" }}>
            <Typography
                variant="h5"
                sx={(theme) => ({
                    width: "100%",
                    borderBottom: `1px solid ${theme.palette.grey[400]}`,
                })}
            >
                Teams ({teams.length})
            </Typography>
            <Grid container spacing={2} sx={{ my: 2 }}>
                {teams.map((team) => (
                    <Grid size={12} key={team.id}>
                        <InfoElement
                            imageUrl={team.profileImageUrl}
                            title={team.teamName}
                            text={team.description}
                            onClick={() => navigate(`/teams/${team.teamId}`)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

TeamList.propTypes = {
    teams: propTypes.array,
    captainId: propTypes.number,
};

export { TeamList };
