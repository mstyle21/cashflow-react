import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CONFIG } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isDisabled = !(email && password && password.length >= 6);
  const { user, loginRedirect, login } = useContext(AuthContext);

  if (user) {
    return <Navigate to={loginRedirect ?? "/"} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await fetch(`${CONFIG.backendUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then(async (response) => {
          const resp = await response.json();

          if (response.ok) {
            return resp;
          } else {
            throw new Error(resp.message);
          }
        })
        .then((data) => {
          login(data.token);
        })
        .catch((error: Error) => {
          setError(error.message);
        });
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        backgroundImage: "url('/images/login-bg.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "rgba(0, 0 ,0 ,0.6)" }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "50px",
            flexDirection: "column",
            border: "1px solid white",
            boxShadow: "0px 0px 16px white",
            padding: "50px 20px",
            background: "rgba(255, 255, 255, 0.4)",
          }}
        >
          <h1 className="text-white">Login to your account</h1>
          {error && <Box className="alert alert-danger">{error}</Box>}
          <Box display="flex" flexDirection="column" gap="20px">
            <input
              type="email"
              placeholder="Email"
              value={email}
              className="form-control"
              // required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="form-control"
              // required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <button
            // type="submit"
            className="btn btn-info text-white"
            disabled={isDisabled}
          >
            Login
          </button>
        </form>
      </Box>
    </Box>
  );
}
