import { ArrowBack, Home } from "@mui/icons-material";
import { Button, Grid2, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Paper sx={{ padding: { xs: 1, md: 3 } }}>
            <Grid2
                container
                spacing={1}
                sx={{ width: "100%", justifyContent: "center" }}
            >
                <Grid2 size={12}>
                    <Typography
                        element="h1"
                        variant="h3"
                        textAlign="center"
                        id="not-found"
                    >
                        404
                    </Typography>
                    <Typography element="h2" variant="h4" textAlign="center">
                        Page Not Found
                    </Typography>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }} sx={{ paddingX: 3 }}>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="contained"
                        fullWidth
                        startIcon={<ArrowBack />}
                    >
                        Go Back
                    </Button>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }} sx={{ paddingX: 3 }}>
                    <Button
                        onClick={() => navigate("/")}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<Home />}
                    >
                        Go Home
                    </Button>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export { NotFound };
