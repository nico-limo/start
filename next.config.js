/* eslint-disable @typescript-eslint/no-var-requires */
const intercept = require("intercept-stdout");
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: true,
  },
  reactStrictMode: true,
};

function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return "";
  }
  return text;
}

intercept(interceptStdout);

module.exports = nextConfig;
