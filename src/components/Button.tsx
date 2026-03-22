"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
}

export default function Button({ children, href, onClick, variant = "primary", className = "" }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 font-bold uppercase tracking-[0.15em] transition-all duration-300 transform shadow-md hover:shadow-xl";

    const variants = {
        primary: "bg-primary text-background hover:bg-white industrial-border hover:scale-105",
        secondary: "bg-secondary text-background hover:bg-white industrial-border hover:scale-105",
        outline: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black hover:shadow-lg",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
            >
                <Link href={href} prefetch={false} className={combinedClassName}>
                    {children}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={combinedClassName}
            type="button"
        >
            {children}
        </motion.button>
    );
}
