import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { ReportGridOne } from "../components/ReportGridOne";
import { ReportGridTwo } from "../components/ReportGridTwo";

const ReportView = () => {
    const [tabIndex, setTabIndex] = useState(0);
    // const [dates, setDates] = useState({ start: "", end: "" });
    const navigate = useNavigate();
    const [reportOne, reportTwo] = useLoaderData();

    const handleTabChange = (_, newIndex) => setTabIndex(newIndex);
    // const handleDateChange = (field) => (e) =>
    //     setDates({ ...dates, [field]: e.target.value });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                p: 4,
                textAlign: "center",
            }}
        >
            <Typography variant="h4" fontWeight="bold" mb={2} color="black">
                Reports
            </Typography>

            {/* Background overlay for better readability */}
            <Paper
                sx={{
                    width: "100%",
                    height: "80%",
                }}
            >
                {/* Date Pickers with Grid2 for Better Alignment */}
                {/* <Grid2
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "100%", mb: 2 }}
                >
                    {["start", "end"].map((field) => (
                        <Grid2
                            xs={12}
                            sm={6}
                            display="flex"
                            justifyContent="center"
                            key={field}
                        >
                            <TextField
                                label={
                                    field === "start"
                                        ? "Start Date"
                                        : "End Date"
                                }
                                type="date"
                                value={dates[field]}
                                onChange={handleDateChange(field)}
                                slotProps={{ inputLabel: { shrink: true } }}
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 1,
                                    width: "100%",
                                    maxWidth: "300px",
                                }}
                            />
                        </Grid2>
                    ))}
                </Grid2> */}

                {/* Tabs with Fixed Styling */}
                <Box sx={{ width: "1200px", height: "100%" }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        sx={(theme) => ({
                            borderBottom: `3px solid ${theme.palette.primary.main}`,
                        })}
                    >
                        {["Sign-Up Status", "Event Status"].map(
                            (label, index) => (
                                <Tab key={index} label={label} />
                            )
                        )}
                    </Tabs>
                </Box>

                {/* Content Section */}
                <Box
                    sx={{
                        p: 4,
                        bgcolor: "white",
                        textAlign: "center",
                        minHeight: "60vh",
                    }}
                >
                    {tabIndex === 0 && (
                        <ReportGridOne
                            data={reportOne.report}
                            totals={reportOne.totals}
                        />
                    )}
                    {tabIndex === 1 && (
                        <ReportGridTwo
                            data={reportTwo.report}
                            totals={reportTwo.totals}
                        />
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export { ReportView };
