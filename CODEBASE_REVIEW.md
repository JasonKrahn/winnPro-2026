# WinnPro Construction Codebase Review

**Review Date:** March 22, 2026  
**Project:** WinnPro Construction Website (Next.js 16 + TypeScript + Tailwind CSS)

## Executive Summary

This is a well-structured Next.js commercial construction portfolio website with integrated CMS (Decap CMS). The codebase follows modern React best practices and implements server-side rendering effectively. However, there are several issues ranging from critical security concerns to minor configuration problems that should be addressed.

**Total Issues Found:** 18  
- Critical (Security/Data): 3
- High (Functionality/Performance): 5  
- Medium (Type Safety/Best Practices): 7
- Low (Documentation/Polish): 3

---

## Critical Issues

### 1. **XSS Vulnerability via `dangerouslySetInnerHTML`**
**File:** [src/app/projects/[category]/[slug]/page.tsx](src/app/projects/%5Bcategory%5D/%5Bslug%5D/page.tsx#L51-L54)  
**Severity:** CRITICAL  
**Issue:** Project content is rendered using `dangerouslySetInnerHTML` with markdown that could contain injected scripts if the markdown source is compromised or if user-generated content is allowed.

```tsx
<div
    className="prose prose-invert max-w-none text-secondary leading-loose"
    dangerouslySetInnerHTML={{ __html: markdownToHtml(project.content) }}
/>
```

**Impact:** Potential arbitrary JavaScript execution in user browsers.  
**Recommendation:** 
- Use a sanitization library like `DOMPurify` or `xss` to sanitize HTML before rendering
- Alternatively, use a React-compatible markdown component like `react-markdown` with safe defaults
- Ensure the markdown parser has security features enabled

---

### 2. **Invalid Date Format in Test Project Data**
**File:** [content/posts/2026-03-07-test.md](content/posts/2026-03-07-test.md)  
**Severity:** CRITICAL  
**Issue:** The `completed` field contains an invalid date: `12/32/86` (day 32 doesn't exist in any month).

```yaml
completed: 12/32/86  # Invalid: December doesn't have 32 days
```

**Impact:** 
- Will display incorrectly on the project detail page
- May cause date parsing errors in some contexts
- Shows invalid data to visitors

**Recommendation:**
- Fix the date: use `12/31/86` or the correct date
- Consider using ISO 8601 format (YYYY-MM-DD) for consistency with the `date` field
- Update CMS config to validate date formats on save

---

### 3. **Hardcoded Sensitive URLs Instead of Environment Variables**
**Files:** 
- [src/app/layout.tsx](src/app/layout.tsx#L13) - hardcoded `https://winnproconstruction.ca`
- [src/components/JsonLd.tsx](src/components/JsonLd.tsx#L6-L10) - hardcoded domain in multiple places
- [public/admin/config.yml](public/admin/config.yml#L8) - hardcoded `https://winnpro.netlify.app`

**Severity:** CRITICAL  
**Issue:** Domain URLs are hardcoded instead of using environment variables, making it impossible to use different domains for development, staging, and production without code changes.

**Recommendation:**
- Create `.env.local` file with:
  ```
  NEXT_PUBLIC_SITE_URL=https://winnproconstruction.ca
  NEXT_PUBLIC_SITE_NAME=WinnPro Construction
  ```
- Replace all hardcoded URLs with environment variables
- Document all required environment variables in README.md

---

## High Priority Issues

### 4. **Missing Error Handling in Content Utilities**
**File:** [src/lib/content.ts](src/lib/content.ts#L98-L105)  
**Severity:** HIGH  
**Issue:** Multiple functions don't handle errors gracefully:

```typescript
export function getSiteSettings(): SiteSettings | null {
    const fullPath = path.join(contentDirectory, 'settings', 'site.json');
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);  // No error handling for invalid JSON
}
```

**Impact:** 
- Malformed JSON in `site.json` will crash the application
- No fallback values provided
- Silent failures in other file operations

**Recommendation:**
- Wrap `JSON.parse()` in try-catch blocks
- Provide meaningful error logging
- Return sensible defaults instead of crashing:
  ```typescript
  try {
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Invalid site.json:', error);
    return { title: 'WinnPro Construction', city: 'Winnipeg', region: 'MB', country: 'CA' };
  }
  ```

---

### 5. **Type Safety Issues with `as any` Type Coercion**
**File:** [src/components/JsonLd.tsx](src/components/JsonLd.tsx#L10)  
**Severity:** HIGH  
**Issue:** Using `as any` bypasses TypeScript type checking, allowing potentially invalid data:

```typescript
'@type': ['ConstructionBusiness', 'GeneralContractor', 'LocalBusiness'] as any,
```

**Impact:**
- Type safety is undermined
- Potential for invalid schema types to slip through
- Makes code harder to maintain

**Recommendation:**
- Create a proper type for schema types or use conditional types:
  ```typescript
  const schemaTypes: Array<'ConstructionBusiness' | 'GeneralContractor' | 'LocalBusiness'> = [
    'ConstructionBusiness',
    'GeneralContractor', 
    'LocalBusiness'
  ];
  '@type': schemaTypes,
  ```

---

### 6. **Video Format Compatibility Issue**
**File:** [src/components/VideoBanner.tsx](src/components/VideoBanner.tsx#L21-L23)  
**Severity:** HIGH  
**Issue:** The component uses `.mov` format which is not supported by many browsers:

```tsx
<source src={videoUrl} type="video/mp4" />
// But videoUrl from home.md is: https://res.cloudinary.com/winnpro/video/upload/.../winnpro_cover_video_pivfix.mov
```

**Impact:**
- Video won't play in most browsers (only works natively in Safari)
- Users on Firefox, Chrome, etc. won't see the video
- Poor user experience

**Recommendation:**
- Use `.mp4` format (H.264 codec) which is universally supported
- Update Cloudinary upload to use MP4 format or set up URL transformation:
  ```tsx
  <video>
    <source src={videoUrl.replace(/\.mov$/, '.mp4')} type="video/mp4" />
    <source src={videoUrl} type="video/quicktime" />
  </video>
  ```
- Add fallback message for unsupported browsers

---

### 7. **Missing Phone Number Display on Contact Page**
**File:** [src/app/contact/page.tsx](src/app/contact/page.tsx)  
**Severity:** HIGH  
**Issue:** Phone number is stored in `site.json` and used in JsonLd schema, but not displayed to users on the contact page.

```json
// In site.json
"phone": "(204) 989-5941"
```

But the contact page only shows email and location, not phone.

**Impact:**
- Users can't easily find phone number without inspecting page source
- Missed opportunity for direct contact
- Inconsistent with header footer patterns

**Recommendation:**
- Add phone number section to contact page:
  ```tsx
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Phone</span>
    <a href={`tel:${settings?.phone}`} className="text-xl font-bold text-primary hover:underline">
      {settings?.phone}
    </a>
  </div>
  ```

---

### 8. **Missing Sitemap Generation**
**File:** [src/app/robots.txt](src/app/robots.txt)  
**Severity:** HIGH  
**Issue:** `robots.txt` references a sitemap that doesn't exist:

```
Sitemap: https://winnproconstruction.ca/sitemap.xml
```

**Impact:**
- Search engines can't find the sitemap
- Reduced SEO effectiveness
- Missing dynamic content discovery

**Recommendation:**
- Add dynamic sitemap generation using Next.js `generateStaticParams`:
  ```typescript
  // src/app/sitemap.ts
  import { MetadataRoute } from 'next';
  import { getAllProjects, getAllCategories } from '@/lib/content';

  export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://winnproconstruction.ca';
    const projects = getAllProjects();
    const categories = getAllCategories();

    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/projects` },
      { url: `${baseUrl}/contact` },
      ...projects.map(p => ({
        url: `${baseUrl}/projects/${p.categories[0]?.category.toLowerCase().replace(/\s+/g, '-')}/${p.slug}`,
        lastModified: new Date(p.date)
      })),
      ...categories.map(c => ({
        url: `${baseUrl}/projects?category=${c.slug}`,
      }))
    ];
  }
  ```

---

## Medium Priority Issues

### 9. **Incomplete Type Safety in Data Casting**
**File:** [src/lib/content.ts](src/lib/content.ts#L42-L55)  
**Severity:** MEDIUM  
**Issue:** Data type assertion doesn't guarantee all required fields are present:

```typescript
export function getProjectBySlug(slug: string): Project {
    // ...
    return {
        slug: realSlug,
        ...(sanitizedData as Omit<Project, 'slug' | 'content'>),  // Could omit required fields
        content,
    };
}
```

**Impact:**
- TypeScript doesn't enforce that all required Project fields are present in YAML
- Could lead to undefined properties at runtime
- Makes components vulnerable to missing data

**Recommendation:**
- Add runtime validation using a schema validator like `zod`:
  ```typescript
  import { z } from 'zod';

  const ProjectSchema = z.object({
    title: z.string(),
    template: z.string(),
    status: z.enum(['Draft', 'Published']),
    date: z.string(),
    // ... other required fields
  });

  export function getProjectBySlug(slug: string): Project {
    const { data, content } = matter(fileContents);
    const validated = ProjectSchema.parse(sanitizedData);
    return { slug: realSlug, ...validated, content };
  }
  ```

---

### 10. **Test File is Incomplete**
**File:** [src/lib/content.test.ts](src/lib/content.test.ts)  
**Severity:** MEDIUM  
**Issue:** The test file cuts off mid-test with incomplete code:

```typescript
describe('getAllProjects', () => {
    it('returns projects sorted by date descending', () => {
        // ... test code ...
        let callCount = 0
        mockedMatter.mockImplementation(() => {
            callCount++
            if (callCount === 1) {
                return { /* ... */ } as any
            }
            return {
                data: {
                    title: 'New Project',
                    // INCOMPLETE - FILE CUTS OFF HERE
```

**Impact:**
- Tests don't run properly
- No validation that content utilities work correctly
- CI/CD pipeline may fail

**Recommendation:**
- Complete the test file with all test cases for:
  - `getProjectSlugs()`
  - `getProjectBySlug()`
  - `getAllProjects()`
  - `getCategorySlugs()`
  - `getCategoryBySlug()`
  - `getAllCategories()`
  - `getPageData()`
  - `getSiteSettings()`

---

### 11. **Missing .env.local Documentation and Validation**
**Severity:** MEDIUM  
**Issue:** No `.env.local` file exists and no environment variable validation is documented.

**Impact:**
- Developers don't know what environment variables are needed
- Production deployment might fail silently
- No clear setup instructions for new developers

**Recommendation:**
- Create `.env.local.example`:
  ```
  # Site Configuration
  NEXT_PUBLIC_SITE_URL=https://winnproconstruction.ca
  NEXT_PUBLIC_SITE_NAME=WinnPro Construction

  # Netlify CMS
  NEXT_PUBLIC_CMS_URL=https://winnpro.netlify.app

  # Optional: Build-time settings
  BUILD_ENVIRONMENT=production
  ```
- Add validation in `next.config.ts` or create a `src/utils/env.ts` file
- Update README.md with setup instructions

---

### 12. **Category Slug Mismatch Issues**
**Files:** 
- [src/app/projects/page.tsx](src/app/projects/page.tsx#L33)
- [src/components/ProjectCard.tsx](src/components/ProjectCard.tsx#L13)

**Severity:** MEDIUM  
**Issue:** Category slugs are generated by lowercasing and replacing spaces, but category records use different formats. If a category title is "Office Buildings" it becomes "office-buildings", but there's no validation that they match:

```typescript
// In page.tsx - generates slug from category name
const categorySlug = (project.categories?.[0]?.category || "general")
  .toLowerCase()
  .replace(/\s+/g, '-');

// But categories have their own slugs in files that may not match
```

**Impact:**
- Category filtering might break if category title changes
- Links could be inconsistent
- Potential for links to 404

**Recommendation:**
- Store actual slug in category records
- Update Project interface to include category slug
- Add validation to ensure slugs are consistent across content files

---

### 13. **Button Component Missing ARIA Labels and Proper Type**
**File:** [src/components/Button.tsx](src/components/Button.tsx)  
**Severity:** MEDIUM  
**Issue:** The Button component when using motion for animation doesn't properly pass button type and lacks proper accessibility:

```tsx
export default function Button({ children, href, onClick, variant = "primary", className = "" }: ButtonProps) {
    // ...
    if (href) {
        return (
            <Link href={href} prefetch={false}>
                <motion.button
                    // Missing type attribute and aria labels
                    className={combinedClassName}
                >
                    {children}
                </motion.button>
            </Link>
        );
    }
}
```

**Impact:**
- Improper semantics (Link with button inside is wrong)
- Screen readers may not properly identify controls
- Not keyboard accessible when used as a link

**Recommendation:**
- Fix semantics by using native button or proper link styling:
  ```tsx
  if (href) {
    return (
      <Link href={href} prefetch={false} className={combinedClassName}>
        {children}
      </Link>
    );
  }
  ```

---

### 14. **Missing Mobile Menu Accessibility Issues**
**File:** [src/components/Header.tsx](src/components/Header.tsx#L48-L49)  
**Severity:** MEDIUM  
**Issue:** Mobile menu toggle button has accessibility label but menu itself has z-index issues and no focus management:

```tsx
{isMobileMenuOpen && (
    <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-muted shadow-lg z-40">
        // z-40 but header is z-50, menu will be hidden
```

**Impact:**
- Mobile menu could be hidden behind header in some scenarios
- No focus trap for keyboard navigation
- No focus restoration when menu closes
- Poor accessibility for keyboard users

**Recommendation:**
- Fix z-index: change `z-40` to `z-40` is below `z-50` so change to `z-[45]` or use CSS modules
- Add focus management:
  ```tsx
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      menuRef.current?.focus();
    }
  }, [isMobileMenuOpen]);
  ```

---

### 15. **Content Directory Validation Missing**
**File:** [src/lib/content.ts](src/lib/content.ts#L12)  
**Severity:** MEDIUM  
**Issue:** No validation that the content directory exists or is accessible:

```typescript
const contentDirectory = path.join(process.cwd(), 'content');
// Doesn't check if this directory exists
```

**Impact:**
- Will crash with cryptic fs errors if content folder is missing
- No helpful error message for misconfiguration
- Harder to debug deployment issues

**Recommendation:**
- Add directory validation on module load:
  ```typescript
  const contentDirectory = path.join(process.cwd(), 'content');
  
  if (!fs.existsSync(contentDirectory)) {
    throw new Error(`Content directory not found at ${contentDirectory}`);
  }
  ```

---

## Low Priority Issues

### 16. **Incomplete CMS Config for Projects**
**File:** [public/admin/config.yml](public/admin/config.yml#L87)  
**Severity:** LOW  
**Issue:** The "Completed Date" field in CMS is defined as `string` instead of `date` widget, allowing invalid dates like `12/32/86`:

```yaml
- { label: "Completed Date", name: "completed", widget: "string", required: false }
```

**Impact:**
- CMS doesn't validate date format on input
- Users can enter invalid dates (as seen in test post)
- Inconsistent with other date fields

**Recommendation:**
- Change to date widget:
  ```yaml
  - { label: "Completed Date", name: "completed", widget: "date", format: "yyyy-MM-dd", required: false }
  ```

---

### 17. **Missing robots.txt for Disallow Admin**
**Severity:** LOW  
**Issue:** While robots.txt disallows `/admin/`, the actual admin UI at `/admin/` loads from static HTML which might index. The NextAuth/CMS setup might not be properly protected from search engines.

**Recommendation:**
- Ensure all admin routes return proper `X-Robots-Tag: noindex` headers
- Consider authentication before serving admin interface
- Test with: `curl -I https://winnproconstruction.ca/admin/`

---

### 18. **Missing License and Contributing Guidelines**
**Severity:** LOW  
**Issue:** No LICENSE file, CONTRIBUTING.md, or development setup documentation.

**Recommendation:**
- Add LICENSE file (MIT, Apache 2.0, or your choice)
- Create CONTRIBUTING.md with:
  - Dev setup instructions
  - Git workflow
  - CMS usage guide
  - Deployment process
- Create DEVELOPMENT.md with:
  - Environment variable setup
  - Local development commands
  - Database/content structure
  - Testing procedures

---

## Configuration and Dependencies Review

### Dependencies
- **Next.js 16.1.6** ✓ Latest stable, good choice
- **React 19.2.3** ✓ Latest, good choice
- **TypeScript 5** ✓ Good for type safety
- **Tailwind CSS 4** ✓ Latest with PostCSS support
- **Decap CMS 3.10.0** ✓ Good for content management
- **Framer Motion 12.34.0** ✓ Good for animations
- **Marked 17.0.4** ⚠️ Should be kept updated for security

### Missing but Recommended
- `zod` - Runtime schema validation
- `DOMPurify` or `sanitize-html` - HTML sanitization (CRITICAL)
- `next-seo` - Better SEO management
- `sharp` - Image optimization (for Next.js Image component)
- `environment-validator` or similar - Env var validation

---

## Summary of Recommended Actions

### Immediate (This Sprint)
1. **Add HTML sanitization** for markdown rendering (Issue #1)
2. **Fix invalid date** in test post (Issue #2)
3. **Move hardcoded URLs to environment variables** (Issue #3)
4. **Add error handling** in content utilities (Issue #4)
5. **Implement sitemap generation** (Issue #8)

### Short Term (Next 2 Weeks)
6. Fix type safety issues with schema validation (Issue #9)
7. Complete test file (Issue #10)
8. Create environment variable documentation (Issue #11)
9. Fix category slug consistency (Issue #12)

### Medium Term (Next Month)
10. Improve accessibility in Header and Button (Issues #13, #14)
11. Add focus management to mobile menu
12. Update CMS config for proper date validation (Issue #16)
13. Add LICENSE, CONTRIBUTING, and DEVELOPMENT docs (Issue #18)

### Nice to Have
14. Add comprehensive error logging
15. Implement API monitoring/observability
16. Add more unit tests for edge cases
17. Create deployment checklist

---

## Testing Recommendations

### Unit Tests to Add
```
✓ Content utilities with error cases
✓ Component rendering with missing data
✓ Date formatting edge cases
✓ Category slug generation
```

### Integration Tests
```
✓ Full project detail page rendering
✓ Category filtering functionality
✓ CMS content updates trigger rebuilds
```

### E2E Tests
```
✓ Homepage load and rendering
✓ Project list filtering
✓ Contact form submission
✓ Mobile responsive behavior
```

---

## Conclusion

The WinnPro Construction website is a well-structured Next.js project with good architecture and component organization. The main concerns are around security (XSS vulnerability), data validation, and proper error handling. By addressing the critical and high-priority issues, the site will be significantly more robust and maintainable.

The project demonstrates good use of modern React patterns, server-side rendering, and static generation. With the recommended fixes, this will become an enterprise-grade website.
