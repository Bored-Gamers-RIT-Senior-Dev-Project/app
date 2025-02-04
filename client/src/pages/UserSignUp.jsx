import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../firebase/config";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";

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
  const [showPassword, setShowPassword] = useState(false);
  const [universityOptions, setUniversityOptions] = useState([]);
  const [message, setMessage] = useState("");
  const submit = usePostSubmit();
  const actionData = useActionData();
  const navigate = useNavigate();

  // Mock function to simulate fetching universities
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    events.publish("spinner.open");

    if (signUpData.password !== signUpData.repeatPassword) {
      setMessage("Passwords do not match");
      // setLoading(false); // Ensure loading stops here
      events.publish("spinner.close");
      return;
    }
    let idToken = null;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        signUpData.email,
        signUpData.password
      );
      idToken = await user.getIdToken();
      submit({
        idToken,
        ...signUpData,
        email: signUpData.email,
        // password: signUpData.password,  //We probably don't need to send the password to our API if we're handling logins through Firebase's Auth system.  May be more secure, idk.
        username: signUpData.username,
        role: signUpData.role,
        schoolName: signUpData.schoolName,
        teamOption: signUpData.teamOption,
        teamName: signUpData.teamName,
      });
    } catch (error) {
      console.error("Sign-up error:", error);
      setMessage(`Sign-up failed: ${error.message}`);
    } finally {
      // setLoading(false);
      events.publish("spinner.close");
    }
  };

  useEffect(() => {
    if (actionData) {
      events.publish("spinner.close");
      events.publish("message", { message: actionData.message });
      if (actionData.message === "Welcome!") {
        navigate("/"); // Redirect to home on successful sign-up
      }
    }
  }, [actionData, navigate]);

  //TODO: Fix improper (and deprecated) use of Grid.  Do we even need Grid vs a Box in Display:flex here?
  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Create Your Account
        </Typography>
        <form onSubmit={handleSignUpSubmit}>
          <TextField
            label="Email"
            name="email"
            value={signUpData.email}
            onChange={handleSignUpChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Username"
            name="username"
            value={signUpData.username}
            onChange={handleSignUpChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={signUpData.password}
            onChange={handleSignUpChange}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Repeat Password"
            name="repeatPassword"
            type={showPassword ? "text" : "password"}
            value={signUpData.repeatPassword}
            onChange={handleSignUpChange}
            fullWidth
            required
            margin="normal"
          />
          <Divider sx={{ my: 2 }} />
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
          <Divider sx={{ my: 2 }} />
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
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
        {message && (
          <Typography sx={{ mt: 2, textAlign: "center", color: "red" }}>
            {message}
          </Typography>
        )}
        {/* TODO: Sign in link should look more like a link rather than plaintext  */}
        <Typography
          sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/signin")}
        >
          Already have an account? Sign In
        </Typography>
      </Paper>
    </Grid>
  );
};

export { UserSignUp };
