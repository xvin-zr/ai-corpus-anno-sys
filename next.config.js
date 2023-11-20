/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "n9fsx5vawnhnz4ce.public.blob.vercel-storage.com",
          port: "",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
          port: "",
          pathname: "/**",
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  