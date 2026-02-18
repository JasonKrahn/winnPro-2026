import { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    withGrid?: boolean;
}

export default function Container({ children, className = "", withGrid = false }: ContainerProps) {
    return (
        <div className={`container mx-auto px-6 ${withGrid ? "industrial-grid" : ""} ${className}`}>
            {children}
        </div>
    );
}
