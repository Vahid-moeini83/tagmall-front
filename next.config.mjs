/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.tagmall.ir",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
