import { LocalBusiness, WithContext } from 'schema-dts';

export default function JsonLd() {
    const schema: WithContext<LocalBusiness> = {
        '@context': 'https://schema.org',
        '@type': 'ConstructionBusiness' as any,
        name: 'WinnPro Construction',
        image: 'https://winnproconstruction.ca/logo.png',
        '@id': 'https://winnproconstruction.ca',
        url: 'https://winnproconstruction.ca',
        telephone: '',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '',
            addressLocality: 'Winnipeg',
            addressRegion: 'MB',
            postalCode: '',
            addressCountry: 'CA',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 49.8951,
            longitude: -97.1384,
        },
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
        sameAs: [
            // Add social links here
        ],
        areaServed: 'Winnipeg',
        description: "Winnipeg's premier commercial construction contractors. High-performance, industrial-grade building and renovations.",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
