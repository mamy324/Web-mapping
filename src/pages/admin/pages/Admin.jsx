import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// MUI
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert
} from "@mui/material";

export default function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/admin/login", {
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        setMsg("success");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        setMsg(res.data.message);
      }

    } catch {
      setMsg("Erreur serveur");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d111b", // fond global bleu nuit foncé
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 3,
          backgroundColor: "#161b2f", // bloc login bleu nuit clair
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          mb={3}
          fontWeight="bold"
          sx={{ color: "#ffffff" }} // texte du titre en blanc
        >
          Login Admin
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: "#a0aec0" } }} // label gris clair
          InputProps={{ style: { color: "#ffffff" } }} // texte saisi en blanc
        />

        <TextField
          label="Mot de passe"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "#a0aec0" } }}
          InputProps={{ style: { color: "#ffffff" } }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            backgroundColor: "#2f855a", // bouton vert foncé
            "&:hover": { backgroundColor: "#276749" },
            color: "#ffffff"
          }}
          onClick={handleLogin}
        >
          Se connecter
        </Button>

        {/* Message */}
        {msg && (
          <Box mt={2}>
            {msg === "success" ? (
              <Alert severity="success">Connexion réussie ✅</Alert>
            ) : (
              <Alert severity="error">{msg}</Alert>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
