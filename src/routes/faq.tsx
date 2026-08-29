import { createFileRoute } from "@tanstack/react-router";
import FAQ from "@/pages/FAQ";
import { loadPublishedFaqs } from "@/lib/seoLoaders";

export const Route = createFileRoute("/faq")({
  loader: () => loadPublishedFaqs(),
  head: ({ loaderData }) => {
    const faqs = loaderData ?? [];
    if (!faqs.length) return {};
    return {
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
