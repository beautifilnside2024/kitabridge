import withPWA from "next-pwa";
const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});
const nextConfig = {
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/fachkraft/einstellungen',
        destination: '/fachkraft/dashboard',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/arbeitgeber/dashboard',
        permanent: true,
      },
    ];
  },
};
export default pwaConfig(nextConfig);