import type { MetadataRoute } from 'next';
import { getMachines } from '@/lib/api';

const SITE_URL = 'https://fdarriendos.cl';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/equipos`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contacto`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    const machines = await getMachines();
    const machineRoutes: MetadataRoute.Sitemap = machines.map((m) => ({
      url: `${SITE_URL}/equipos/${m.id}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    return [...staticRoutes, ...machineRoutes];
  } catch {
    return staticRoutes;
  }
}
