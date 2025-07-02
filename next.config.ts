import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "allowedDevOrigins"
: ["http://localhost:3000"],

  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"ik.imagekit.io",
        port:""
      }
    ],
  },

};

export default nextConfig;
