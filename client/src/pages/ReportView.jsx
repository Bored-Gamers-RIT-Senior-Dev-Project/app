import { useState } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Paper,
    TextField,
    Grid2 as Grid,
    Button,
    useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router";

const ReportView = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [dates, setDates] = useState({ start: "", end: "" });
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery("(max-width: 1200px)");

    const handleTabChange = (_, newIndex) => setTabIndex(newIndex);
    const handleDateChange = (field) => (e) => setDates({ ...dates, [field]: e.target.value });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                background: "url('/background.jpg') center/cover",
                p: 4,
                ml: isSidebarOpen ? "250px" : "0",
                width: isSidebarOpen ? "calc(100% - 250px)" : "100%",
                transition: "margin 0.3s ease",
                textAlign: "center",
            }}
        >
            <Typography variant="h4" fontWeight="bold" mb={2} color="black">
                Reports
            </Typography>

            <Grid container spacing={2} justifyContent="center" mb={2} sx={{ width: "100%" }}>
                {['start', 'end'].map((field) => (
                    <Grid item key={field}>
                        <TextField
                            label={field === "start" ? "Start Date" : "End Date"}
                            type="date"
                            value={dates[field]}
                            onChange={handleDateChange(field)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ bgcolor: "white", borderRadius: 1, width: "220px" }}
                        />
                    </Grid>
                ))}
            </Grid>

            <Paper elevation={3} sx={{ width: isSmallScreen ? "100%" : "900px", borderRadius: 2, mb: "-1px" }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    TabIndicatorProps={{ style: { display: "none" } }}
                >
                    {["Sign-Up Status", "Event Status", "Analytics"].map((label, index) => (
                        <Tab
                            key={label}
                            label={label}
                            sx={{
                                bgcolor: tabIndex === index ? "#1565c0" : "#e0e0e0",
                                color: tabIndex === index ? "white" : "black",
                                borderRadius: index === 0 ? "10px 0 0 0" : index === 2 ? "0 10px 0 0" : "0",
                                fontWeight: "bold",
                                flexGrow: 1,
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            <Box
                sx={{
                    p: 4,
                    bgcolor: "white",
                    minHeight: "500px",
                    minWidth: isSmallScreen ? "95%" : "900px",
                    borderRadius: "0 0 10px 10px",
                    textAlign: "center",
                    boxShadow: 2,
                }}
            >
                {tabIndex === 0 && <Typography variant="h6">Sign-Up Status Data Here</Typography>}
                {tabIndex === 1 && <Typography variant="h6">Event Status Data Here</Typography>}
                {tabIndex === 2 && (
                    <Box>
                        <Typography variant="h6">Analytics Data Here</Typography>
                        <Box mt={2}>
                            <Button variant="contained" color="primary" onClick={() => navigate("/admin/users")}>
                                Open Analytics Dashboard
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export { ReportView };