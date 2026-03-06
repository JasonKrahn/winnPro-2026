interface VideoBannerProps {
    videoUrl: string;
    overlayText: string;
}

export default function VideoBanner({ videoUrl, overlayText }: VideoBannerProps) {
    return (
        <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
            {/* Full-bleed video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Overlay text */}
            <div className="relative z-10 flex items-center justify-center h-full px-6">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white text-center leading-tight max-w-4xl">
                    {overlayText}
                </h2>
            </div>
        </section>
    );
}
