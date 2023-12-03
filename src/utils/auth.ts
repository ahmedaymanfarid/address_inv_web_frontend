// utils/auth.ts

import { jwtDecode, JwtPayload } from "jwt-decode";

export const signin = async  (
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
    return Promise.reject(res);
  }

  const data = await res.json();
  console.log(data);

  const { access_token, refresh_token } = data;

  // Store tokens securely (e.g., in localStorage or sessionStorage)
  setAccessToken(access_token);
  setRefreshToken(refresh_token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem("access_token", token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem("refresh_token", token);
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
    // If the refresh token is expired or not available, redirect to login
    window.location.href = "/login";
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
    window.location.href = "/login";
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
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Redirect to the home page
  window.location.href = "/sign-in";
}

export const getValidToken = async (): Promise<string | null> => {
  let accessToken = getAccessToken();
  if (!accessToken || isAccessTokenExpired()) {
    // If the access token is expired or not available, refresh the tokens
    accessToken = await refreshTokens();
  }

  return accessToken;
};
