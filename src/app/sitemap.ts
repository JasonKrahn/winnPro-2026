import { MetadataRoute } from 'next';
import { getAllProjects, getAllCategories } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://winnproconstruction.ca';
    const projects = getAllProjects();
    const categories = getAllCategories();

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        ...projects.map(project => ({
            url: `${baseUrl}/projects/${(project.categories?.[0]?.category || 'general').toLowerCase().replace(/\s+/g, '-')}/${project.slug}`,
            lastModified: new Date(project.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        ...categories.map(category => ({
            url: `${baseUrl}/projects?category=${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
    ];
}
