"use client";
import { Copyright } from "@/components/Copyright";
import { HttpMethod, getData } from "@/utils/api";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Card, LinearProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function SignUp() {
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleCustomError = (status: number, message: string) => {
    // Custom logic to handle errors
    console.error(`Custom error handler: ${status} - ${message}`);

    if (status === 404) {
      throw new Error("Employee not found");
    } else if (status === 400) {
      throw new Error("Employee already registered");
    } else if (status === 422) {
      throw new Error("Check your inputs");
    }
  };

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
      await getData(
        `/employees/register`,
        HttpMethod.PUT,
        undefined,
        body,
        handleCustomError
      );
    } catch (error: any) {
      setError(error.message);
      return;
    } finally {
      setLoading(false);
    }
    window.location.href = process.env.BASE_PATH + "/sign-in";
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Card
        raised
        sx={{
          borderRadius: 4,
          marginTop: 5,
          paddingX: 5,
          paddingBottom: 3,
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
            src={"/app/logo_text.png"}
            width={396}
            height={128.7}
            alt="Address Investments Logo"
          />
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
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
                <Typography variant="body2">
                  <Link style={{ color: "inherit" }} href="/sign-in">
                    Already have an account? Sign in
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Card>
    </Container>
  );
}
