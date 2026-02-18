"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function ContactForm() {
    return (
        <form
            name="contact"
            method="POST"
            data-netlify="true"
            className="flex flex-col gap-6"
        >
            <input type="hidden" name="form-name" value="contact" />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-secondary">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="h-14 bg-muted px-6 text-white outline-none focus:ring-2 focus:ring-primary transition-all industrial-border"
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
                        className="h-14 bg-muted px-6 text-white outline-none focus:ring-2 focus:ring-primary transition-all industrial-border"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-secondary">Subject</label>
                <select
                    id="subject"
                    name="subject"
                    className="h-14 bg-muted px-6 text-white outline-none focus:ring-2 focus:ring-primary transition-all industrial-border appearance-none"
                >
                    <option value="quote">Request a Quote</option>
                    <option value="inquiry">General Inquiry</option>
                    <option value="commercial">Commercial Partnership</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-secondary">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Tell us about your project..."
                    className="bg-muted p-6 text-white outline-none focus:ring-2 focus:ring-primary transition-all industrial-border min-h-[150px]"
                ></textarea>
            </div>

            <div className="flex justify-end pt-4">
                <Button variant="primary" className="w-full md:w-auto">
                    Send Message
                </Button>
            </div>
        </form>
    );
}
