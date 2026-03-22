import { getProjectBySlug, getAllProjects, markdownToHtml } from "@/lib/content";
import { sanitizeHtml } from "@/lib/sanitize";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectSchema from "@/components/ProjectSchema";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
    const projects = getAllProjects();
    return projects.map((project) => ({
        category: (project.categories?.[0]?.category || 'general').toLowerCase().replace(/\s+/g, '-'),
        slug: project.slug,
    }));
}

type Props = {
    params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://winnproconstruction.ca';
    
    if (!slug) return {};
    
    try {
        const project = getProjectBySlug(slug);
        const category = (project.categories?.[0]?.category || 'general').toLowerCase().replace(/\s+/g, '-');
        
        return {
            title: `${project.title} | WinnPro Construction - Commercial Contractor`,
            description: project.meta?.description || `${project.title} - A commercial construction project completed by WinnPro Construction in Winnipeg, Manitoba.`,
            alternates: {
                canonical: `/projects/${category}/${slug}`,
            },
            openGraph: {
                title: project.title,
                description: project.meta?.description || `Commercial construction project: ${project.title}`,
                url: `${siteUrl}/projects/${category}/${slug}`,
                type: 'website',
                images: [
                    {
                        url: `${siteUrl}${project.featuredImage}`,
                        width: 1200,
                        height: 630,
                        alt: project.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: project.title,
                description: project.meta?.description,
                images: [`${siteUrl}${project.featuredImage}`],
            },
        };
    } catch (e) {
        return {};
    }
}

export default async function ProjectDetailPage({ params }: Props) {
    const { slug, category: urlCategory } = await params;

    if (!slug) notFound();

    let project;
    try {
        project = getProjectBySlug(slug);
    } catch (e) {
        console.error(e);
        notFound();
    }

    // Sanitize the HTML to prevent XSS attacks
    const sanitizedHtml = sanitizeHtml(markdownToHtml(project.content));
    
    const category = urlCategory || (project.categories?.[0]?.category || 'general').toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex min-h-screen flex-col">
            <ProjectSchema project={project} category={category} />
            <Header />

            <main className="flex-grow">
                <div className="relative h-[50vh] w-full overflow-hidden">
                    <Image
                        src={project.featuredImage}
                        alt={project.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <Container className="relative flex h-full items-end pb-12">
                        <div className="max-w-4xl">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">
                                {project.categories?.[0]?.category || "Project Case Study"}
                            </span>
                            <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
                                {project.title}
                            </h1>
                        </div>
                    </Container>
                </div>

                <section className="py-20">
                    <Container>
                        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <div
                                    className="prose prose-invert max-w-none text-secondary leading-loose [&>h4]:text-white [&>h4]:text-lg [&>h4]:font-black [&>h4]:uppercase [&>h4]:mb-6 [&>h4]:mt-12 [&>h4]:pt-6 [&>h4]:border-t [&>h4]:border-muted [&>h4]:underline [&>h4]:decoration-primary [&>h4]:decoration-4 [&>h4]:underline-offset-8 [&>h4:first-of-type]:mt-0 [&>h4:first-of-type]:pt-0 [&>h4:first-of-type]:border-t-0"
                                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                                />
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="bg-muted p-8 industrial-border">
                                    <h4 className="mb-6 text-xs font-black uppercase tracking-widest text-white">Project Details</h4>
                                    <div className="space-y-6">
                                        {project.budget && (
                                            <div className="flex flex-col border-b border-background pb-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Budget</span>
                                                <span className="text-lg font-bold text-white">{project.budget}</span>
                                            </div>
                                        )}
                                        {project.architect && (
                                            <div className="flex flex-col border-b border-background pb-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Architect</span>
                                                <span className="text-lg font-bold text-white">{project.architect}</span>
                                            </div>
                                        )}
                                        {project.completed && (
                                            <div className="flex flex-col border-b border-background pb-4">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Completion</span>
                                                <span className="text-lg font-bold text-white">{project.completed}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {project.gallery && project.gallery.length > 0 && (
                    <section className="bg-muted py-20 border-t border-muted">
                        <Container>
                            <h3 className="mb-12 text-xs font-black uppercase tracking-[0.4em] text-white text-center">
                                Project Gallery
                            </h3>
                            <ProjectGallery items={project.gallery} />
                        </Container>
                    </section>
                )}

                {/* Back to Projects */}
                <section className="py-20 bg-background">
                    <Container>
                        <div className="flex justify-center">
                            <a
                                href="/projects"
                                className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-primary hover:text-white transition-colors group"
                            >
                                <span className="transform group-hover:translate-x-1 transition-transform duration-300">←</span>
                                Back to All Projects
                            </a>
                        </div>
                    </Container>
                </section>
            </main>

            <Footer />
        </div>
    );
}
