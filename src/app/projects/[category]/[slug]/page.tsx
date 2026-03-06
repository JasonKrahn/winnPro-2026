import { getProjectBySlug, getAllProjects, markdownToHtml } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProjectGallery from "@/components/ProjectGallery";
import Image from "next/image";
import { notFound } from "next/navigation";

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

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;

    if (!slug) notFound();

    let project;
    try {
        project = getProjectBySlug(slug);
    } catch (e) {
        console.error(e);
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col">
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
                                <h3 className="mb-6 text-xs font-black uppercase tracking-[0.4em] text-white underline decoration-primary decoration-4 underline-offset-8">
                                    Project Overview
                                </h3>
                                <div
                                    className="prose prose-invert max-w-none text-secondary leading-loose"
                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(project.content) }}
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
            </main>

            <Footer />
        </div>
    );
}
