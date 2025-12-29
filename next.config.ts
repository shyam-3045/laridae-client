import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images:{
    domains:['res.cloudinary.com']
  }
};

export default nextConfig;
