/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  env: {
    API_URL: process.env.API_URL,
    BASE_PATH: process.env.BASE_PATH,
  },
};

module.exports = nextConfig;
