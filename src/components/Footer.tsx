/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-muted bg-background py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand Info */}
                    <div className="flex flex-col gap-6 md:col-span-2">
                        <Link href="/" prefetch={false} className="flex items-center gap-2">
                            <img src="/logo.png" alt="WinnPro Logo" width={160} height={40} className="h-10 w-auto" />
                            <div className="flex flex-col font-black uppercase leading-none">
                                <span className="text-xl tracking-tight text-white">WinnPro</span>
                                <span className="text-[10px] tracking-[0.2em] text-primary">Construction</span>
                            </div>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-secondary italic">
                            "We are Winnipeg&apos;s premier commercial construction contractors, delivering high-performance builds and industrial-grade quality."
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Navigation</h3>
                        <nav className="flex flex-col gap-3">
                            <Link href="/projects" prefetch={false} className="text-sm text-secondary hover:text-primary transition-colors">Projects</Link>
                            <Link href="/contact" prefetch={false} className="text-sm text-secondary hover:text-primary transition-colors">Contact</Link>
                            <Link href="/admin" prefetch={false} className="text-sm text-secondary hover:text-primary transition-colors">Admin Login</Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">Location</h3>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-secondary">
                                Winnipeg, Manitoba<br />
                                Canada
                            </p>
                            <div className="mt-4 flex flex-col gap-2">
                                <a href="mailto:info@winnproconstruction.ca" className="text-sm text-primary hover:underline italic font-medium">info@winnproconstruction.ca</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between border-t border-muted pt-12 md:flex-row">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">
                        &copy; {new Date().getFullYear()} WinnPro Construction Ltd.
                    </p>
                    <div className="mt-4 flex gap-6 md:mt-0">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">
                            High Performance | Industrial Grade
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
