import { LocalBusiness, WithContext } from 'schema-dts';
import { getSiteSettings } from '@/lib/content';

export default function JsonLd() {
    const settings = getSiteSettings();

    const schema: WithContext<LocalBusiness> = {
        '@context': 'https://schema.org',
        '@type': ['ConstructionBusiness', 'GeneralContractor', 'LocalBusiness'] as any,
        name: 'WinnPro Construction',
        image: 'https://winnproconstruction.ca/logo.png',
        '@id': 'https://winnproconstruction.ca',
        url: 'https://winnproconstruction.ca',
        telephone: settings?.phone || '',
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
        areaServed: {
            '@type': 'City',
            name: settings?.city || 'Winnipeg',
            '@id': 'https://en.wikipedia.org/wiki/Winnipeg'
        },
        knowsAbout: [
            'Commercial Construction',
            'Industrial Retrofits',
            'Retail Space Construction',
            'Office Building Development',
            'General Contracting',
            'Tenant Improvements'
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
        description: settings?.description || "Winnipeg's premier commercial construction contractors.",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
