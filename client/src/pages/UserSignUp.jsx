import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useActionData, useNavigate } from "react-router";
import { usePostSubmit } from "../hooks/usePostSubmit";
import { events } from "../utils/events";
import { signUpWithEmail } from "../utils/firebase/auth";

const handleErrors = (error) => {
  // Handle specific error messages here if needed
  switch (error) {
    default:
      console.error("Sign-in error:", error);
      events.publish("message", {
        message: "An unexpected error occurred",
        severity: "error",
      });
  }
};

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
  const submit = usePostSubmit();
  const actionData = useActionData();
  const navigate = useNavigate();

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    events.publish("spinner.open");

    if (signUpData.password !== signUpData.repeatPassword) {
      //TODO: Make the form validate this automatically, rather than on submit.
      events.publish("Message", {
        message: "Passwords do not match",
        severity: "warning",
      });
      events.publish("spinner.close");
      return;
    }
    let idToken = null;
    try {
      const user = await signUpWithEmail(signUpData.email, signUpData.password);
      idToken = await user.getIdToken();
      submit({
        idToken,
        email: signUpData.email,
        username: signUpData.username,
      });
    } catch (error) {
      handleErrors(error);
    } finally {
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

  return (
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
      {/* TODO: Sign in link should look more like a link rather than plaintext  */}
      <Typography
        sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
        onClick={() => navigate("/signin")}
      >
        Already have an account? Sign In
      </Typography>
    </Paper>
  );
};

export { UserSignUp };
