"use client";

import { useState } from "react";

interface ServiceItem {
    title: string;
    description: string;
}

interface ServiceAccordionProps {
    items: ServiceItem[];
}

export default function ServiceAccordion({ items }: ServiceAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div
                        key={item.title}
                        className="border-l-4 border-primary bg-muted overflow-hidden transition-all duration-300"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between px-8 py-6 text-left cursor-pointer group hover:bg-background/50 transition-colors"
                            aria-expanded={isOpen}
                        >
                            <span className="text-sm md:text-base font-black uppercase tracking-widest text-white">
                                {item.title}
                            </span>
                            <svg
                                className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                }`}
                        >
                            <div className="overflow-hidden">
                                <p className="px-8 pb-6 text-secondary leading-relaxed text-[15px]">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
