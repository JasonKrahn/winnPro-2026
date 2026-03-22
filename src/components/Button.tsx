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
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button({ children, href, onClick, variant = "primary", className = "", type = "button", disabled = false }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 font-bold uppercase tracking-[0.15em] transition-all duration-300 transform shadow-md hover:shadow-xl";

    const variants = {
        primary: "bg-primary text-background hover:bg-white industrial-border hover:scale-105",
        secondary: "bg-secondary text-background hover:bg-white industrial-border hover:scale-105",
        outline: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black hover:shadow-lg",
    };

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed hover:shadow-md hover:scale-100" : "";
    const combinedClassName = `${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`;

    if (href) {
        return (
            <motion.div
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
                className="inline-block"
            >
                <Link href={href} prefetch={false} className={combinedClassName} onClick={(e) => disabled && e.preventDefault()}>
                    {children}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={combinedClassName}
            type={type}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
