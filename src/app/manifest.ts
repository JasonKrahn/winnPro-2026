import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://winnproconstruction.ca';

  return {
    name: 'WinnPro Construction',
    short_name: 'WinnPro',
    description: 'Winnipeg\'s premier commercial and industrial general contractor. Specializing in retail, office, and industrial retrofits.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    theme_color: '#050505',
    background_color: '#050505',
    categories: ['business', 'construction'],
    screenshots: [
      {
        src: '/images/og-image.jpg',
        sizes: '540x720',
        type: 'image/jpeg',
        form_factor: 'narrow',
      },
      {
        src: '/images/og-image.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        form_factor: 'wide',
      },
    ],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48 64x64 128x128 256x256',
        type: 'image/x-icon',
      },
    ],
  };
}
