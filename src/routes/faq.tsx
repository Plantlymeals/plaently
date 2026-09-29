import { createFileRoute } from "@tanstack/react-router";
import FAQ from "@/pages/FAQ";
import { loadPublishedFaqs } from "@/lib/seoLoaders";
import { buildStaticPageHead } from "@/lib/staticPageHead";
import { tSv } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  loader: () => loadPublishedFaqs(),
  head: ({ loaderData }) => {
    const faqs = loaderData ?? [];
    const base = buildStaticPageHead({
      lang: "sv",
      svPath: "/faq",
      title: tSv("seo.faq.title"),
      description: tSv("seo.faq.description"),
    });
    if (!faqs.length) return base;
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question_sv || faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer_sv || faq.answer },
            })),
          }),
        },
      ],
    };
  },
  component: FAQ,
});
