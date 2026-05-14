/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  // The CMS lives at public/admin/index.html. Vercel auto-serves directory
  // indexes for static files, but `next dev` doesn't — without this rewrite,
  // /admin returns 404 locally. Adding the rewrite makes both environments
  // behave the same way.
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/index.html" },
    ];
  },

  // Lets the dev server respond to requests from devices on your LAN
  // (e.g. testing on your phone over Wi-Fi). Production builds ignore this.
  // Next.js matches these as globs, not CIDR — `*` is any segment.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*", "*.local"],
};

export default nextConfig;
