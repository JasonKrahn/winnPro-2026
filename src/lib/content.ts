import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export function markdownToHtml(markdown: string): string {
    return marked.parse(markdown, { async: false }) as string;
}

const contentDirectory = path.join(process.cwd(), 'content');

export interface Project {
    slug: string;
    title: string;
    template: string;
    status: string;
    date: string;
    featuredImage: string;
    budget?: string;
    completed?: string;
    architect?: string;
    categories: { category: string }[];
    gallery: { image: string; alt?: string; title?: string }[];
    meta: { title: string; description: string };
    content: string;
}

export interface Category {
    slug: string;
    title: string;
    subtitle: string;
    featuredImage: string;
    meta: { noindex: boolean; title: string; description: string };
}

export function getProjectSlugs() {
    const postsDir = path.join(contentDirectory, 'posts');
    return fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
}

export function getProjectBySlug(slug: string): Project {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, 'posts', `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure all date fields are strings to avoid React rendering errors
    const sanitizedData = { ...data };
    Object.keys(sanitizedData).forEach(key => {
        if (sanitizedData[key] instanceof Date) {
            sanitizedData[key] = sanitizedData[key].toISOString().split('T')[0];
        }
    });

    return {
        slug: realSlug,
        ...(sanitizedData as Omit<Project, 'slug' | 'content'>),
        content,
    };
}

export function getAllProjects(): Project[] {
    const slugs = getProjectSlugs();
    const projects = slugs.map((slug) => getProjectBySlug(slug))
        .filter((project) => project.status !== 'Draft')
        .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
    return projects;
}

export function getCategorySlugs() {
    const categoriesDir = path.join(contentDirectory, 'postCategories');
    return fs.readdirSync(categoriesDir).filter(file => file.endsWith('.md'));
}

export function getCategoryBySlug(slug: string): Category {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, 'postCategories', `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
        slug: realSlug,
        ...(data as Omit<Category, 'slug'>),
    };
}

export function getAllCategories(): Category[] {
    const slugs = getCategorySlugs();
    const categories = slugs.map((slug) => getCategoryBySlug(slug));
    return categories;
}

export function getPageData(pageName: string) {
    const fullPath = path.join(contentDirectory, 'pages', `${pageName}.md`);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return data;
}

export interface SiteSettings {
    title: string;
    description: string;
    phone?: string;
    email?: string;
    streetAddress?: string;
    city: string;
    region: string;
    postalCode?: string;
    country: string;
}

export function getSiteSettings(): SiteSettings | null {
    const fullPath = path.join(contentDirectory, 'settings', 'site.json');
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
}
