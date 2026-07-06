/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled because react-leaflet v4 double-initializes the Leaflet map under
  // React 18 StrictMode's dev double-mount ("Map container is already
  // initialized"). Leaflet is core to every map page, so we opt out globally.
  reactStrictMode: false,
};

export default nextConfig;
