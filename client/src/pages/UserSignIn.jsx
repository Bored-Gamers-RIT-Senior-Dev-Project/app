import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

const UserSignIn = () => {
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signInData.email,
        signInData.password
      );
      const idToken = await userCredential.user.getIdToken();
      

      // Send ID Token to backend
      const response = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read response as text
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      setMessage("Sign in successful!");
      window.location.href = "/dashboard"; // Redirect to dashboard
    } catch (error) {
      console.error("Sign-in error:", error);
      setMessage(`Sign-in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
  
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(); 
      
  
      // Send token to the backend
      const response = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
  
      const data = await response.json();
      setMessage("Google Sign-in successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      setMessage(`Google Sign-In failed: ${error.message}`);
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
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Sign in with Google"}
      </Button>
      <Typography
        sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
        onClick={() => (window.location.href = "/signup")}
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
