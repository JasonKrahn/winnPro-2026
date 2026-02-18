import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects, getPageData } from "@/lib/content";
import Image from "next/image";

export default function Home() {
  const allProjects = getAllProjects();
  const featuredProjects = allProjects.slice(0, 3);
  const homeData = getPageData("home");

  if (!homeData) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex min-h-[90vh] items-center py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://ucarecdn.com/c5e798e8-f3b7-4df5-b89d-974402eb980c/-/progressive/yes/-/format/auto/-/resize/2000x/"
              alt="Industrial Construction Background"
              fill
              className="object-cover opacity-60 grayscale-[30%]"
              priority
            />
            {/* Dialed back gradient for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            <div className="absolute inset-0 industrial-grid opacity-20" />
          </div>

          <Container className="relative z-10">
            <div className="max-w-4xl">
              <span className="mb-4 block text-sm font-black uppercase tracking-[0.4em] text-primary">
                {homeData.hero.eyebrow}
              </span>
              <h1 className="mb-8 text-6xl font-black uppercase leading-none tracking-tight text-white md:text-8xl">
                {homeData.hero.title1} <br />
                <span className="text-primary italic">{homeData.hero.title2}</span>
              </h1>
              <p className="mb-12 max-w-xl text-lg font-medium leading-relaxed text-secondary md:text-xl">
                {homeData.hero.description}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button href="/projects" variant="primary">
                  View Our Projects
                </Button>
                <Button href="/contact" variant="outline">
                  Get a Quote
                </Button>
              </div>
            </div>
          </Container>

          {/* Subtle Accent Object */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
            <div className="h-[500px] w-96 border-[40px] border-muted rotate-12" />
          </div>
        </section>

        {/* Featured Projects */}
        <section className="bg-background py-32">
          <Container>
            <div className="mb-16 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-primary">Portfolio</span>
                <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">Featured Works</h2>
              </div>
              <Button href="/projects" variant="outline" className="px-6 py-2 text-xs">
                View All Projects &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </section>

        {/* Services / Local Focus */}
        <section className="border-y border-muted bg-muted py-32">
          <Container>
            <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
              <div>
                <h2 className="mb-8 text-4xl font-black uppercase tracking-tight text-white">
                  {homeData.services.title1} <br />
                  <span className="text-primary">{homeData.services.title2}</span>
                </h2>
                <p className="mb-8 text-lg text-secondary italic">
                  {homeData.services.subtitle}
                </p>
                <div className="space-y-6">
                  {homeData.services.list.map((service: string) => (
                    <div key={service} className="flex items-center gap-4 border-l-4 border-primary bg-background/50 p-6">
                      <span className="text-lg font-bold uppercase tracking-widest text-white">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative industrial-border overflow-hidden group">
                <Image
                  src="https://ucarecdn.com/556c37b7-9fb2-4808-a10b-cd4be7234d75/-/crop/1500x817/0,0/-/preview/-/enhance/76/"
                  alt="WinnPro Project - Mastermind Toys"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-center">
                    <span className="text-6xl font-black text-white/20 uppercase tracking-[0.2em]">Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Accreditation Badges */}
        <section className="py-20 bg-background border-b border-muted">
          <Container className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary mb-8 block">
              Safety & Standards
            </span>
            <div className="relative h-16 w-64 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all flex items-center justify-center">
              <img
                src="/core-and-procore.jpg"
                alt="CORE and Procore Certified"
                className="max-h-full w-auto object-contain"
              />
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
