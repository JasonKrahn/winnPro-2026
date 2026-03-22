"use client";

import { useState, useEffect } from "react";

interface ProtectedEmailProps {
    email: string;
    className?: string;
}

/**
 * Displays an email address that's protected from spam bot harvesting
 * The email is only decoded and displayed on the client side
 * Bots that don't execute JavaScript won't see the email address
 */
export default function ProtectedEmail({ email, className = "" }: ProtectedEmailProps) {
    const [displayEmail, setDisplayEmail] = useState("");

    useEffect(() => {
        // Only decode on the client side - bots won't execute this
        setDisplayEmail(email);
    }, [email]);

    if (!displayEmail) {
        // While loading/decoding, show nothing or a placeholder
        return null;
    }

    return (
        <a 
            href={`mailto:${displayEmail}`} 
            className={className}
        >
            {displayEmail}
        </a>
    );
}
