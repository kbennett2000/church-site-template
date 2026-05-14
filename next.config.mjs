import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack infers the workspace root by searching for next/package.json,
  // but it can misidentify the root when the project is nested or cloned into
  // an unexpected path — triggering "couldn't find the Next.js package" errors.
  // Setting root explicitly to the directory that contains this config file
  // makes Turbopack work regardless of where the repo is cloned.
  // __dirname isn't available in ES module configs, so we derive it from
  // import.meta.url (see top of file).
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  // The CMS admin is built to public/admin/index.html by `tinacms build` (run
  // via `npm run cms` in development or `npm run build` in production).
  // Vercel auto-serves directory indexes for static files, but `next dev`
  // doesn't — without this rewrite, /admin returns 404 locally.
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
