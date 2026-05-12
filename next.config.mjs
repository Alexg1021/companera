/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/brief", destination: "/companera_brief.html" },
    ];
  },
};

export default nextConfig;
