import { Button, Grid2 as Grid } from "@mui/material";
import propTypes from "../utils/propTypes";

const TeamList = ({ university, teams }) => {
    return (
        <Grid container>
            <Grid size={12}>
                <Button fullWidth variant="contained">
                    Form a new Team
                </Button>
            </Grid>
        </Grid>
    );
};
TeamList.propTypes = {
    university: propTypes.number,
    teams: propTypes.array.isRequired,
};

export { TeamList };
