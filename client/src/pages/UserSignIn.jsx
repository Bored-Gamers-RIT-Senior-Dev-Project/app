import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

const UserSignIn = () => {
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Sign in successful!");
        navigate("/dashboard"); // Redirect after successful sign-in
      } else {
        const errorText = await response.text();
        setMessage(`Sign in failed: ${errorText}`);
      }
    } catch (error) {
      setMessage("An error occurred during sign in.");
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
        User Sign In
      </Typography>
      <form onSubmit={handleSignInSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={signInData.email}
          onChange={handleSignInChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={signInData.password}
          onChange={handleSignInChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>
      </form>
      <Typography
        sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
        onClick={() => navigate("/signup")}
      >
        No account? Sign Up
      </Typography>
      {message && (
        <Typography sx={{ mt: 2, textAlign: "center", color: "red" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export { UserSignIn };
