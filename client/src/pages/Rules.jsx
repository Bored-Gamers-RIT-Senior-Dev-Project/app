import { Box, Paper, Typography, Stack } from "@mui/material";
import { ImageHolder } from "../components/ImageHolder";
import setupimg from "../assets/rules/setup.jpg";  

const Rules = () => {
  return (
    <Box sx={{ padding: { xs: 3, md: 5 } }}>
      <Paper
        component="div"
        sx={{
          padding: { xs: 3, md: 4 },
          maxWidth: "900px",
          margin: "auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: 4,
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: "800px", margin: "auto" }}>
          <Typography
            component="h1"
            sx={{
              fontSize: "2.5em",
              fontWeight: "bold",
              textAlign: "center",
              paddingBottom: "15px",
              color: "#333",
            }}
          >
            Tournament Rules
          </Typography>

          {/* Image Section */}
          <Box sx={{ padding: "5px 10px" }}>
            <ImageHolder
              src={setupimg}
              alt="Setup Guide"
              sx={{
                width: "100%",
                maxWidth: "650px",
                display: "block",
                margin: "auto",
                borderRadius: "10px",
                boxShadow: 2,
              }}
            />
          </Box>

          {/* Eligibility and Registration Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Eligibility and Registration
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Registration for this tournament is limited to countries in which participation is legal. If there is a difference of opinion in interpretation of the law, Aardvark Games’ legal counsel will have the final word on a Team’s ability to register.
            </Typography>
          </Box>

          {/* Team Composition Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Team Composition
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Each Team will have at least two, but no more than five, members.
            </Typography>
          </Box>

          {/* Registration Deadline Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Registration Deadline
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              The deadline for registration is midnight EDT on Monday, May 1, 2024, unless an extension for all is publicized on the tournament website. Registration must be completed on the tournament website.
            </Typography>
          </Box>

          {/* Eligibility Verification Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Eligibility Verification
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Each Team member must be currently enrolled at the college/university that the Team wishes to represent. A Team member may not play for more than one college in the 2024 tournament. Eligibility will be verified in advance with the college and team members will be required to present valid student IDs on the day of the on-site tournament. Any questions regarding IDs on the day of the tournament will be decided by the on-site Moderator representing the college.
            </Typography>
          </Box>

          {/* Forfeits and Absences Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Forfeits and Absences
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Any Team that fails to appear in person and on time on the day of the on-campus tournament round forfeits that game.
            </Typography>
          </Box>

          {/* Tournament Scheduling and Matchups Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Tournament Scheduling and Matchups
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              The dates of tournament game play and all Team matchups will be selected by Aardvark Games. If an odd number of teams register for any site, the first team to complete registration will be awarded a bye in the first round of competition.
            </Typography>
          </Box>

          {/* Gameplay and Scoring Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Gameplay and Scoring
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Game play and scoring will take place according to the printed rules shipped with the game. Tournament play will be run consistently at each location to ensure that all players are treated equally. Both players and moderators are expected to cooperate to run an orderly competition. Players and moderators must treat each other in a fair and respectful manner, following both the rules and the spirit in which those rules were created.
            </Typography>
          </Box>

          {/* Moderators and Player Conduct Section */}
          <Box sx={{ padding: "0 10px" }}>
            <Typography
              component="h2"
              sx={{
                fontSize: "1.4em",
                fontWeight: "bold",
                textAlign: "left",
                paddingBottom: "8px",
                borderBottom: "2px solid #ddd",
              }}
            >
              Moderators and Player Conduct
            </Typography>
            <Typography
              sx={{
                fontSize: "1.1em",
                textAlign: "justify",
                lineHeight: "1.6",
                color: "#444",
              }}
            >
              Aardvark Games reserves the right to alter these rules, as well as the right to interpret, modify, clarify, or otherwise issue official changes to these rules without prior notice.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export { Rules };
