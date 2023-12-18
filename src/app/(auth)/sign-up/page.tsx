"use client";
import { HttpMethod, getData } from "@/utils/api";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LinearProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default function SignUp() {
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (event.currentTarget.reportValidity() === false) {
      return;
    }
    const data = new FormData(event.currentTarget);

    if (data.get("password") !== data.get("confirm-password")) {
      alert("Passwords do not match");
      return;
    }

    let body: { [key: string]: any } = {
      business_email: data.get("business-email"),
      personal_email: data.get("personal-email"),
      personal_phone: data.get("personal-phone"),
      password: data.get("password"),
    };
    try {
      setLoading(true);
      await getData(`/employees/register`, HttpMethod.PUT, undefined, body);
    } catch (error: any) {
      setError(error.message);
      return;
    } finally {
      setLoading(false);
    }
    window.location.href = "/sign-in";
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {loading && <LinearProgress />}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                disabled={loading}
                id="business-email"
                label="Business Email Address"
                name="business-email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled={loading}
                id="personal-email"
                label="Personal Email Address"
                name="personal-email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled={loading}
                id="personal-phone"
                label="Personal Phone Number"
                name="personal-phone"
                autoComplete="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                disabled={loading}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                disabled={loading}
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              {error && <Alert severity="error">{error}</Alert>}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
