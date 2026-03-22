import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import ProtectedEmail from "@/components/ProtectedEmail";
import { getSiteSettings } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact Us | WinnPro Construction',
  description: 'Get in touch with WinnPro Construction. We\'re ready to discuss your commercial construction project in Winnipeg. Call or fill out our contact form.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | WinnPro Construction',
    description: 'Contact WinnPro Construction for your commercial construction needs in Winnipeg.',
    url: 'https://winnproconstruction.ca/contact',
    type: 'website',
  },
};

export default function ContactPage() {
    const settings = getSiteSettings();
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-grow py-20 relative">
                <div className="absolute inset-x-0 top-0 h-64 industrial-grid opacity-20" />

                <Container className="relative">
                    <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Get in Touch</span>
                            <h1 className="mt-4 mb-8 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
                                Let&apos;s Build <br />
                                <span className="text-primary italic">Something Great.</span>
                            </h1>
                            <p className="mb-12 text-lg text-secondary leading-relaxed">
                                Whether you have a specific project in mind or just want to explore possibilities, our team is ready to discuss your commercial construction needs in Winnipeg.
                            </p>

                            <div className="space-y-8">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</span>
                                    <p className="text-xl font-bold text-white">Winnipeg, MB, Canada</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Phone</span>
                                    <a href={`tel:${settings?.phone}`} className="text-xl font-bold text-primary hover:underline transition-all underline-offset-4">
                                        {settings?.phone || "(204) 989-5941"}
                                    </a>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Email</span>
                                    <ProtectedEmail 
                                        email="info@winnproconstruction.ca"
                                        className="text-xl font-bold text-primary hover:underline transition-all underline-offset-4"
                                    />
                                </div>
                                <div className="mt-12 h-1 w-20 bg-primary" />
                            </div>
                        </div>

                        <div className="bg-muted p-8 md:p-12 industrial-border">
                            <h3 className="mb-8 text-sm font-black uppercase tracking-widest text-white">Project Inquiry Form</h3>
                            <ContactForm />
                        </div>
                    </div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
