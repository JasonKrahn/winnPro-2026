/**
 * Simple obfuscation utility to protect email addresses from spam bots
 * Encodes/decodes strings using character code manipulation
 */

export function obfuscateEmail(email: string): string {
    return email
        .split('')
        .map((char) => `&#${char.charCodeAt(0)};`)
        .join('');
}

export function deobfuscateEmail(encoded: string): string {
    // This is client-side only, so spam bots that don't execute JS won't see it
    const parser = new DOMParser();
    const decoded = parser.parseFromString(`<!doctype html><body>${encoded}`, 'text/html').body.textContent || '';
    return decoded;
}
