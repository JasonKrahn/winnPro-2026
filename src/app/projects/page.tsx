import { getAllProjects, getAllCategories } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

type Props = {
    searchParams: Promise<{ category?: string }>;
};

export default async function ProjectsPage({ searchParams }: Props) {
    const { category } = await searchParams;
    const allProjects = getAllProjects();
    const categories = getAllCategories();

    const filteredProjects = category
        ? allProjects.filter(p => p.categories.some(c => c.category.toLowerCase().replace(/\s+/g, '-') === category))
        : allProjects;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-grow py-20 pb-32">
                <Container>
                    <div className="mb-16">
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary underline decoration-primary decoration-4 underline-offset-8">
                            Portfolio
                        </span>
                        <h1 className="mt-8 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
                            Our <span className="text-primary italic">Projects.</span>
                        </h1>
                    </div>

                    {/* Categories Filter */}
                    <div className="mb-12 flex flex-wrap gap-4">
                        <Link
                            href="/projects"
                            prefetch={false}
                            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${!category ? 'bg-primary text-background' : 'industrial-border text-secondary hover:text-white hover:border-white'}`}
                        >
                            All
                        </Link>
                        {categories.map((cat) => {
                            const isActive = category === cat.slug;
                            return (
                                <Link
                                    key={cat.slug}
                                    href={`/projects?category=${cat.slug}`}
                                    prefetch={false}
                                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-primary text-background' : 'industrial-border text-secondary hover:text-white hover:border-white'}`}
                                >
                                    {cat.title}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.slug} project={project} />
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-secondary uppercase tracking-widest text-xs font-bold">No projects found in this category.</p>
                        </div>
                    )}
                </Container>
            </main>

            <Footer />
        </div>
    );
}
