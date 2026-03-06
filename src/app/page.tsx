import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import ProjectCard from "@/components/ProjectCard";
import VideoBanner from "@/components/VideoBanner";
import ServiceAccordion from "@/components/ServiceAccordion";
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
              src="/images/c5e798e8-f3b7-4df5-b89d-974402eb980c.jpg"
              alt="Industrial Construction Background"
              fill
              sizes="100vw"
              className="object-cover opacity-75 grayscale-[45%]"
              priority
            />
            {/* Dialed back gradient for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            <div className="absolute inset-0 industrial-grid opacity-40" />
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
                  Contact Us
                </Button>
              </div>
            </div>
          </Container>

          {/* Subtle Accent Object */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
            <div className="h-[500px] w-96 border-[40px] border-muted rotate-12" />
          </div>
        </section>

        {/* About Us Section */}
        {homeData.about && (
          <section className="bg-muted py-24 md:py-32 border-b border-muted">
            <Container>
              <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
                    {homeData.about.eyebrow}
                  </span>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl mb-8">
                    {homeData.about.title}
                  </h2>
                  <div className="space-y-6 text-secondary text-lg leading-relaxed">
                    {homeData.about.body.split("\n\n").map((paragraph: string, i: number) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  {/* What We Do */}
                  <div className="mt-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">
                      {homeData.about.whatWeDoTitle}
                    </h3>
                    <p className="text-secondary text-lg leading-relaxed italic">
                      {homeData.about.whatWeDoBody}
                    </p>
                  </div>
                </div>

                <div>
                  {/* Sectors list */}
                  <div className="mb-12">
                    {homeData.about.sectorsTitle && (
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6">
                        {homeData.about.sectorsTitle}
                      </h3>
                    )}
                    <div className="space-y-3">
                      {homeData.about.sectors?.map((sector: string) => (
                        <div
                          key={sector}
                          className="flex items-center gap-4 border-l-4 border-primary bg-background/50 p-5"
                        >
                          <span className="text-base font-bold uppercase tracking-widest text-white">
                            {sector}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        )}

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

        {/* Video Banner */}
        {homeData.videoBanner?.published && (
          <VideoBanner
            videoUrl={homeData.videoBanner.videoUrl}
            overlayText={homeData.videoBanner.overlayText}
          />
        )}

        {/* Service Offerings Accordion */}
        {homeData.serviceOfferings && homeData.serviceOfferings.length > 0 && (
          <section className="bg-background py-24 md:py-32">
            <Container>
              <div className="mb-12 text-center">
                <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
                  What We Offer
                </span>
                <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                  Our Services
                </h2>
              </div>
              <div className="max-w-4xl mx-auto">
                <ServiceAccordion items={homeData.serviceOfferings} />
              </div>
            </Container>
          </section>
        )}

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
                  src="/images/27c33ffd-09cb-4cc9-9723-6a52db83f8b7.jpg"
                  alt="WinnPro Project - Winnipeg Credit Union"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">

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

