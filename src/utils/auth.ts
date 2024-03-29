// utils/auth.ts

import { components } from "@/interfaces/db_interfaces";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const signin = async (
  username: string,
  password: string
): Promise<void> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const res = await fetch(process.env.API_URL + "/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Change content type
    },
    body: formData.toString(), // Convert FormData to a string
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Invalid credentials");
    } else if (res.status === 400) {
      throw new Error("Inactive user");
    } else {
      throw new Error("Something went wrong");
    }
  }

  const data = await res.json();
  console.log(data);

  const { access_token, refresh_token } = data;

  // Store tokens securely (e.g., in localStorage or sessionStorage)
  setAccessToken(access_token);
  setRefreshToken(refresh_token);
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("access_token");
  }
  return null;
};

export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("access_token", token);
  }
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("refresh_token");
  }
  return null;
};

export const setRefreshToken = (token: string): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("refresh_token", token);
  }
};

export const isAccessTokenExpired = (): boolean => {
  const token = getAccessToken();
  if (!token) {
    return true;
  }

  // Decode the token to get the expiration time
  const decodedToken = jwtDecode<JwtPayload>(token)!;

  // Check if the token has expired
  return Date.now() >= (decodedToken.exp || 0) * 1000;
};

export const isRefreshTokenExpired = (): boolean => {
  const token = getRefreshToken();
  if (!token) {
    return true;
  }

  // Decode the refresh token to get the expiration time
  const decodedToken = jwtDecode<JwtPayload>(token)!;

  // Check if the refresh token has expired
  return Date.now() >= (decodedToken.exp || 0) * 1000;
};

export const refreshTokens = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken || isRefreshTokenExpired()) {
    return null;
  }

  // Make a request to your server to refresh the access token using the refresh token
  const formData = new URLSearchParams();
  formData.append("refresh_token", refreshToken);
  formData.append("grant_type", "refresh_token");
  const response = await fetch(process.env.API_URL + "/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Change content type
    },
    body: formData.toString(), // Convert FormData to a string
  });

  if (!response.ok) {
    // Handle the case where the refresh request fails
    return null;
  }

  const data = await response.json();
  const newAccessToken = data.access_token;

  // Save the new access token
  setAccessToken(newAccessToken);

  return newAccessToken;
};

export const signout = (): void => {
  // Remove tokens from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("employee");

    // Redirect to the home page
    window.location.href = process.env.BASE_PATH + "/sign-in";
  }
};

export const getValidToken = async (): Promise<string | null> => {
  let accessToken = getAccessToken();
  if (!accessToken || isAccessTokenExpired()) {
    // If the access token is expired or not available, refresh the tokens
    accessToken = await refreshTokens();
  }

  return accessToken;
};
