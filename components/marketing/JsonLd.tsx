export function JsonLd() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Crescent Code",
        url,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Indore",
          addressCountry: "IN",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Crescent hotel and restaurant management",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          description: "Interactive demo",
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
