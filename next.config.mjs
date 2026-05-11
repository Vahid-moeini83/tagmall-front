/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.tagmall.ir",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "backend.tagmall.ir",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tagmall.ir",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
