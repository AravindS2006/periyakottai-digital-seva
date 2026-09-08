import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://periyakottai.vercel.app';
  const currentDate = new Date();

  const routes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/services', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/schemes', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/farmer-hub', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/news', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/csc-centre', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/murugesan', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/contacts', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/notices', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/grievance', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/documents', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/panchayat', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/track', changeFrequency: 'daily' as const, priority: 0.6 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
