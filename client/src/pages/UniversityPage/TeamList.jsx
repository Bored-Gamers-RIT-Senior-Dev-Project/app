import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { InfoElement } from "../../components/InfoElement";
import propTypes from "../../utils/propTypes";

const TeamList = ({ teams }) => {
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
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {teams.map((team) => (
                    <Grid size={12} key={team.id}>
                        <InfoElement
                            imageUrl={team.profileImageUrl}
                            title={team.teamName}
                            text={team.description}
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
