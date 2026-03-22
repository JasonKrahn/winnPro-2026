import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export function sanitizeHtml(html: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window as any);
    return purify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
        KEEP_CONTENT: true,
    });
}
