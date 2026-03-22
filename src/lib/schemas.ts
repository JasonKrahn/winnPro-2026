/**
 * Helper to generate structured data schemas for SEO
 */

import { BreadcrumbList, CreativeWork, WithContext } from 'schema-dts';

export function generateProjectSchema(
    project: {
        title: string;
        slug: string;
        featuredImage: string;
        completed: string;
        architect?: string;
        categories: { category: string }[];
    },
    siteUrl: string,
    category: string
): WithContext<CreativeWork> {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: `Commercial construction project: ${project.title}`,
        image: `${siteUrl}${project.featuredImage}`,
        url: `${siteUrl}/projects/${category}/${project.slug}`,
        author: {
            '@type': 'Organization',
            name: 'WinnPro Construction',
            url: siteUrl,
        },
        datePublished: project.completed,
        inLanguage: 'en-CA',
        isPartOf: {
            '@type': 'Website',
            name: 'WinnPro Construction',
            url: siteUrl,
        },
        keywords: [project.title, 'commercial construction', 'Winnipeg', ...(project.categories?.map(c => c.category) || [])].join(', '),
    };
}

export function generateBreadcrumbSchema(
    items: { name: string; url: string }[],
    siteUrl: string
): WithContext<BreadcrumbList> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.url}`,
        })),
    };
}
