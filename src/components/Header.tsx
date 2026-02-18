/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-md overflow-x-hidden">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="WinnPro Logo" className="h-10 w-auto" />
                    <div className="hidden flex-col font-black uppercase leading-none md:flex">
                        <span className="text-xl tracking-tight text-white group-hover:text-primary transition-colors">WinnPro</span>
                        <span className="text-[10px] tracking-[0.2em] text-primary">Construction</span>
                    </div>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <Link href="/projects" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Projects
                    </Link>
                    <Link href="/contact" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/contact"
                        className="hidden bg-primary px-6 py-2 text-xs font-black uppercase tracking-widest text-background hover:bg-white transition-all md:block industrial-border"
                    >
                        Get a Quote
                    </Link>
                    {/* Mobile Menu Placeholder */}
                    <button className="block md:hidden text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
