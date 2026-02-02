export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Linkway Learning",
    url: "https://linkwaylearning.com",
    logo: "https://linkwaylearning.com/images/logo/linkway-learning.jpeg",
    description:
      "India's leading data analytics and AI training institute. Industry-driven programs. Only 100% placement. No guarantee or assistance.",
    sameAs: [
      "https://www.instagram.com/linkwaylearning",
      "https://www.linkedin.com/company/linkway-learning",
      "https://www.youtube.com/@linkwaylearning",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9315647113",
      contactType: "admissions",
      availableLanguage: ["English", "Hindi"],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "8200",
      bestRating: "5",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Linkway Learning",
    url: "https://linkwaylearning.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://linkwaylearning.com/courses?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CourseJsonLd({
  name,
  description,
  url,
  duration,
  skills,
}: {
  name: string;
  description: string;
  url: string;
  duration?: string;
  skills?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "EducationalOrganization",
      name: "Linkway Learning",
      url: "https://linkwaylearning.com",
    },
    ...(duration && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "blended",
        duration,
      },
    }),
    ...(skills && {
      teaches: skills.join(", "),
    }),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "500",
      bestRating: "5",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
