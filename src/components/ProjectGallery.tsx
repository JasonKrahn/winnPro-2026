"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
    image: string;
    alt?: string;
    title?: string;
}

interface ProjectGalleryProps {
    items: GalleryItem[];
}

export default function ProjectGallery({ items }: ProjectGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
        }
    }, [selectedIndex, items.length]);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
        }
    }, [selectedIndex, items.length]);

    // Keyboard support and Body Scroll lock
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") setSelectedIndex(null);
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };

        if (selectedIndex !== null) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex, handleNext, handlePrev]);

    if (!items || items.length === 0) return null;

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square overflow-hidden group industrial-border cursor-pointer bg-muted"
                        onClick={() => setSelectedIndex(index)}
                    >
                        <Image
                            src={item.image}
                            alt={item.alt || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-white bg-background/80 px-4 py-2 backdrop-blur-sm">View Full</span>
                        </div>
                        {item.title && (
                            <div className="absolute inset-x-0 bottom-0 bg-background/80 p-4 translate-y-full group-hover:translate-y-0 transition-transform backdrop-blur-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-white">
                                    {item.title}
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-10"
                        onClick={() => setSelectedIndex(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 z-[110] text-white hover:text-primary transition-colors p-2"
                            onClick={() => setSelectedIndex(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation */}
                        {items.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 z-[110] text-white/50 hover:text-white transition-colors p-2 md:left-10"
                                    onClick={handlePrev}
                                >
                                    <ChevronLeft className="w-10 h-10 md:w-16 md:h-16" />
                                </button>
                                <button
                                    className="absolute right-4 z-[110] text-white/50 hover:text-white transition-colors p-2 md:right-10"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="w-10 h-10 md:w-16 md:h-16" />
                                </button>
                            </>
                        )}

                        {/* Main Image Container */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full h-full max-w-6xl max-h-[80vh] flex flex-col items-center justify-center gap-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-full industrial-border">
                                <Image
                                    src={items[selectedIndex].image}
                                    alt={items[selectedIndex].alt || "Lightbox image"}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Info */}
                            <div className="text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">
                                    {selectedIndex + 1} / {items.length}
                                </span>
                                <h4 className="text-xl font-black uppercase tracking-tight text-white">
                                    {items[selectedIndex].title || items[selectedIndex].alt || "WinnPro Construction Project"}
                                </h4>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
