import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // or your custom Cloudinary domain
  },
};

export default nextConfig;
