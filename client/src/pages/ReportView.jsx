import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router";

const ReportView = ({ isSidebarOpen }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [dates, setDates] = useState({ start: "", end: "" });
  const navigate = useNavigate();

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);
  const handleDateChange = (field) => (e) =>
    setDates({ ...dates, [field]: e.target.value });

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

      {/* Background overlay for better readability */}
      <Paper sx={{ bgcolor: "rgba(255, 255, 255, 0.85)", p: 4, borderRadius: 2, maxWidth: "900px", width: "100%" }}>
        
        {/* Date Pickers with Grid2 for Better Alignment */}
        <Grid2 container spacing={2} justifyContent="center" alignItems="center" sx={{ width: "100%", mb: 2 }}>
          {["start", "end"].map((field) => (
            <Grid2 xs={12} sm={6} display="flex" justifyContent="center" key={field}>
              <TextField
                label={field === "start" ? "Start Date" : "End Date"}
                type="date"
                value={dates[field]}
                onChange={handleDateChange(field)}
                InputLabelProps={{ shrink: true }}
                sx={{ bgcolor: "white", borderRadius: 1, width: "100%", maxWidth: "300px" }}
              />
            </Grid2>
          ))}
        </Grid2>

        {/* Tabs with Fixed Styling */}
        <Paper elevation={3} sx={{ width: "100%", borderRadius: "10px 10px 0 0" }}>
          <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
            {["Sign-Up Status", "Event Status", "Analytics"].map((label, index) => (
              <Tab
                key={label}
                label={label}
                sx={{
                    bgcolor: tabIndex === index ? "#a2bee8" : "#e0e0e0",
                    color: tabIndex === index ? "white" : "black",
                    borderRadius: index === 0 ? "10px 0 0 0" : index === 2 ? "0 10px 0 0" : "0",
                    fontWeight: "bold",
                    flexGrow: 1,
                    minHeight: "48px",
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content Section */}
        <Box
          sx={{
            p: 4,
            bgcolor: "white",
            minHeight: "500px",
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
      </Paper>
    </Box>
  );
};

export { ReportView };
