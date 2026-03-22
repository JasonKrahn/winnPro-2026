import { generateProjectSchema, generateBreadcrumbSchema } from "@/lib/schemas";

interface ProjectSchemaProps {
    project: {
        title: string;
        slug: string;
        featuredImage: string;
        completed?: string;
        architect?: string;
        categories: { category: string }[];
    };
    category: string;
}

export default function ProjectSchema({ project, category }: ProjectSchemaProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://winnproconstruction.ca';
    
    const projectSchema = generateProjectSchema(project, siteUrl, category);
    
    const breadcrumbSchema = generateBreadcrumbSchema(
        [
            { name: 'Home', url: '/' },
            { name: 'Projects', url: '/projects' },
            { name: category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), url: `/projects?category=${category}` },
            { name: project.title, url: `/projects/${category}/${project.slug}` },
        ],
        siteUrl
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
                suppressHydrationWarning
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                suppressHydrationWarning
            />
        </>
    );
}
