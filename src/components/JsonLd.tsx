import { LocalBusiness, WithContext } from 'schema-dts';
import { getSiteSettings } from '@/lib/content';

export default function JsonLd() {
    const settings = getSiteSettings();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://winnproconstruction.ca';

    const schema: WithContext<LocalBusiness> = {
        '@context': 'https://schema.org',
        '@type': ['ConstructionBusiness', 'GeneralContractor', 'LocalBusiness'] as any,
        name: 'WinnPro Construction',
        alternateName: ['WinnPro', 'Winn Pro Construction'],
        image: `${siteUrl}/images/og-image.jpg`,
        '@id': siteUrl,
        url: siteUrl,
        telephone: settings?.phone || '(204) 989-5941',
        email: 'info@winnproconstruction.ca',
        priceRange: '$$$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: settings?.streetAddress || '',
            addressLocality: settings?.city || 'Winnipeg',
            addressRegion: settings?.region || 'MB',
            postalCode: settings?.postalCode || '',
            addressCountry: settings?.country || 'CA',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 49.8951,
            longitude: -97.1384,
        },
        areaServed: [
            {
                '@type': 'City',
                name: 'Winnipeg',
            },
            {
                '@type': 'Region',
                name: 'Manitoba',
            },
            {
                '@type': 'Region',
                name: 'Midwestern Canada',
            },
        ],
        knowsAbout: [
            'Commercial Construction',
            'Industrial Retrofits',
            'Retail Space Construction',
            'Office Building Development',
            'General Contracting',
            'Tenant Improvements',
            'Interior Renovations',
            'Shopping Centre Construction',
        ],
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
            ],
            opens: '08:00',
            closes: '17:00',
        },
        sameAs: [],
        description: settings?.description || "WinnPro Construction is Winnipeg's premier commercial and industrial general contractor, specializing in retail, office, and industrial retrofits.",
        foundingDate: '2010',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            telephone: settings?.phone || '(204) 989-5941',
            email: 'info@winnproconstruction.ca',
            availableLanguage: ['en-CA'],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            suppressHydrationWarning
        />
    );
}
