"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/lib/content";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    // Extract category name for display
    const primaryCategory = project.categories?.[0]?.category || "General";

    const categorySlug = (project.categories?.[0]?.category || "general").toLowerCase().replace(/\s+/g, '-');

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden industrial-border bg-muted"
        >
            <Link href={`/projects/${categorySlug}/${project.slug}`} prefetch={false}>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                        src={project.featuredImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-30 transition-opacity duration-500 group-hover:opacity-50" />
                </div>

                <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            {primaryCategory}
                        </span>
                        {project.completed && (
                            <span className="text-[10px] uppercase tracking-widest text-secondary">
                                {project.completed}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                        View Project &rarr;
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
