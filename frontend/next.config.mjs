/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tensoportunidades.com.br",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
  sassOptions: {
    includePaths: ["src"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://tensoportunidades.com.br:8080/:path*",
      },
      {
        source: "/favicon.ico",
        destination: "/public/favicon.ico",
      },
    ];
  },
};

export default nextConfig;