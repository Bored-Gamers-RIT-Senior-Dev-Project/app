import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

const UserSignUp = () => {
  const [signUpData, setSignUpData] = useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
    role: "Follow the Tournament",
    schoolName: "",
    teamOption: "Join an Existing Team",
    teamName: "",
  });
  const [universityOptions, setUniversityOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const mockFetchUniversities = (query) => {
    const allUniversities = [
      "Rochester Institute of Technology",
      "Rice University",
      "Rutgers University",
      "Rensselaer Polytechnic Institute",
      "Royal Holloway, University of London",
    ];
    return allUniversities.filter((university) =>
      university.toLowerCase().startsWith(query.toLowerCase())
    );
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSchoolNameChange = (event, value) => {
    setSignUpData({ ...signUpData, schoolName: value });
  };

  const handleSchoolNameInput = (event) => {
    const query = event.target.value;
    const results = mockFetchUniversities(query);
    setUniversityOptions(results);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (signUpData.password !== signUpData.repeatPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      if (response.ok) {
        setMessage("Sign-up successful!");
        setSignUpData({
          email: "",
          username: "",
          password: "",
          repeatPassword: "",
          role: "Follow the Tournament",
          schoolName: "",
          teamOption: "Join an Existing Team",
          teamName: "",
        });
        navigate("/signin");
      } else {
        const errorText = await response.text();
        setMessage(`Sign-up failed: ${errorText}`);
      }
    } catch (error) {
      setMessage("An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h4" textAlign="center">
        User Sign Up
      </Typography>
      <form onSubmit={handleSignUpSubmit}>
        <TextField
          label="Email"
          name="email"
          value={signUpData.email}
          onChange={handleSignUpChange}
          fullWidth
          required
        />
        <TextField
          label="Username"
          name="username"
          value={signUpData.username}
          onChange={handleSignUpChange}
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={signUpData.password}
          onChange={handleSignUpChange}
          fullWidth
          required
        />
        <TextField
          label="Repeat Password"
          name="repeatPassword"
          type="password"
          value={signUpData.repeatPassword}
          onChange={handleSignUpChange}
          fullWidth
          required
        />
        <Divider />
        <Typography variant="h6">Role</Typography>
        <RadioGroup
          name="role"
          value={signUpData.role}
          onChange={handleSignUpChange}
        >
          <FormControlLabel
            value="Follow the Tournament"
            control={<Radio />}
            label="Follow the Tournament"
          />
          <FormControlLabel
            value="Participate"
            control={<Radio />}
            label="Participate"
          />
          <FormControlLabel
            value="Represent a University"
            control={<Radio />}
            label="Represent a University"
          />
        </RadioGroup>
        <Autocomplete
          options={universityOptions}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              label="School Name"
              onChange={handleSchoolNameInput}
              fullWidth
              disabled={signUpData.role !== "Represent a University"}
            />
          )}
          value={signUpData.schoolName}
          onChange={handleSchoolNameChange}
          disabled={signUpData.role !== "Represent a University"}
        />
        <Divider />
        <Typography variant="h6">Team</Typography>
        <RadioGroup
          name="teamOption"
          value={signUpData.teamOption}
          onChange={handleSignUpChange}
        >
          <FormControlLabel
            value="Start a new Team"
            control={<Radio />}
            label="Start a new Team"
          />
          <FormControlLabel
            value="Join an Existing Team"
            control={<Radio />}
            label="Join an Existing Team"
          />
          <FormControlLabel
            value="I'll do this later"
            control={<Radio />}
            label="I'll do this later"
          />
        </RadioGroup>
        <TextField
          label="Team Name"
          name="teamName"
          value={signUpData.teamName}
          onChange={handleSignUpChange}
          fullWidth
          disabled={signUpData.teamOption !== "Join an Existing Team"}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>
      </form>
      <Typography
        sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
        onClick={() => navigate("/signin")}
      >
        Already have an account? Sign In
      </Typography>
      {message && (
        <Typography sx={{ mt: 2, textAlign: "center", color: "red" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export { UserSignUp };
