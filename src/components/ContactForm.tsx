"use client";

import { motion } from "framer-motion";
import Button from "./Button";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);

            // Honeypot: Check if hidden spam field was filled (bots would fill it)
            const honeypot = formData.get("website");
            if (honeypot) {
                // Silently fail - pretend submission succeeded to confuse bots
                setStatus("success");
                setMessage("Thank you! We've received your message and will get back to you soon.");
                form.reset();
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 5000);
                return;
            }

            // Submit to Netlify
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData as any).toString(),
            });

            if (response.ok) {
                setStatus("success");
                setMessage("Thank you! We've received your message and will get back to you soon.");
                form.reset();
                // Auto-dismiss success message after 5 seconds
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 5000);
            } else {
                setStatus("error");
                setMessage("Something went wrong. Please try again or contact us directly.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to send message. Please try again or contact us directly.");
        }
    };

    return (
        <>
            <form
                name="contact"
                method="POST"
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
                <input type="hidden" name="form-name" value="contact" />
                {/* Honeypot field - hidden from users but catches bots */}
                <input 
                    type="text" 
                    name="website" 
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-secondary">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="John Doe"
                            className="h-14 bg-muted px-6 text-white outline-none border border-muted/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-secondary">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="john@example.com"
                            className="h-14 bg-muted px-6 text-white outline-none border border-muted/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-secondary">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="+1 (204) 555-0000"
                            className="h-14 bg-muted px-6 text-white outline-none border border-muted/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-secondary">Subject</label>
                        <select
                            id="subject"
                            name="subject"
                            required
                            className="h-14 bg-muted px-6 text-white outline-none border border-muted/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                        >
                            <option value="">Select a subject...</option>
                            <option value="quote">Request a Quote</option>
                            <option value="inquiry">General Inquiry</option>
                            <option value="commercial">Commercial Partnership</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-secondary">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        placeholder="Tell us about your project..."
                        className="bg-muted p-6 text-white outline-none border border-muted/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-[150px]"
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        variant="primary" 
                        className="w-full md:w-auto"
                        type="submit"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Sending..." : "Send Message"}
                    </Button>
                </div>
            </form>

            {/* Success Message */}
            {status === "success" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 flex items-center gap-3 rounded-lg bg-green-900/20 border border-primary p-4"
                >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-primary font-medium">{message}</p>
                </motion.div>
            )}

            {/* Error Message */}
            {status === "error" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 flex items-center gap-3 rounded-lg bg-red-900/20 border border-red-500 p-4"
                >
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-500 font-medium">{message}</p>
                </motion.div>
            )}
        </>
    );
}
