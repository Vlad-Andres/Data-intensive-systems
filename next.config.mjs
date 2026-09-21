/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(process.env.GITHUB_ACTIONS &&
    process.env.GITHUB_REPOSITORY && {
      basePath: `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`,
      assetPrefix: `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`,
    }),
};

export default nextConfig;
