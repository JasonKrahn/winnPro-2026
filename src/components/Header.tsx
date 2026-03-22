"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Focus management for mobile menu
    useEffect(() => {
        if (isMobileMenuOpen && menuRef.current) {
            // Trap focus in menu
            const focusableElements = menuRef.current.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }
        }
    }, [isMobileMenuOpen]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-6 relative z-50">
                <Link href="/" prefetch={false} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="WinnPro Logo" className="h-10 w-auto" />
                    <div className="hidden flex-col font-black uppercase leading-none md:flex">
                        <span className="text-xl tracking-tight text-white group-hover:text-primary transition-colors">WinnPro</span>
                        <span className="text-[10px] tracking-[0.2em] text-primary">Construction</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    <Link href="/projects" prefetch={false} className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Projects
                    </Link>
                    <Link href="/#services" prefetch={false} className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Services
                    </Link>
                    <Link href="/contact" prefetch={false} className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/contact"
                        prefetch={false}
                        className="hidden bg-primary px-6 py-2 text-xs font-black uppercase tracking-widest text-background hover:bg-white transition-all md:block industrial-border"
                    >
                        Contact Us
                    </Link>
                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="block md:hidden text-white p-2 focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div ref={menuRef} className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-muted shadow-lg z-[45]">
                    <nav className="flex flex-col px-6 py-6 gap-6">
                        <Link
                            href="/projects"
                            prefetch={false}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-bold uppercase tracking-widest text-white hover:text-primary transition-colors"
                        >
                            Projects
                        </Link>
                        <a
                            href="/#services"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                const element = document.getElementById('services');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="text-lg font-bold uppercase tracking-widest text-white hover:text-primary transition-colors cursor-pointer"
                        >
                            Services
                        </a>
                        <Link
                            href="/contact"
                            prefetch={false}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-bold uppercase tracking-widest text-white hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/contact"
                            prefetch={false}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="inline-block self-start mt-4 bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-background hover:bg-white transition-all industrial-border"
                        >
                            Contact Us
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
