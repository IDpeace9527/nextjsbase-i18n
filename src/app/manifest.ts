import {MetadataRoute} from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#101E33',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      }
    ]
  };
}
