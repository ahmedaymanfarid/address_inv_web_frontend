"use client";
import { Copyright } from "@/components/Copyright";
import { isRefreshTokenExpired, signin } from "@/utils/auth";
import { TrySharp } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Card, CardContent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignIn() {
  const [error, setError] = React.useState<string>("");
  if (!isRefreshTokenExpired()) {
    window.location.href = process.env.BASE_PATH + "/";
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (typeof email !== "string" || typeof password !== "string") {
      return;
    }
    try {
      await signin(email, password);
    } catch (error: any) {
      setError(error.message);
      return;
    }
    window.location.href = process.env.BASE_PATH + "/";
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Card
        raised
        sx={{
          borderRadius: 4,
          marginTop: 10,
          paddingX: 5,
          paddingTop: 5,
          width: 450,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src={process.env.BASE_PATH + "/logo_text.png"}
            width={396}
            height={128.7}
            alt="Address Investments Logo"
          />
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
              <Grid item>
                <Typography variant="body2">
                  <Link style={{ color: "inherit" }} href="/sign-up">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Card>
    </Container>
  );
}
