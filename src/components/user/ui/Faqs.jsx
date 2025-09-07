import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { cn } from "@/lib/utils";
import React from "react";

const staticFaqs = [
  {
    question: "Do I need to provide any cleaning materials or chemicals?",
    answer:
      "No, our professionals carry all necessary cleaning supplies and equipment.",
  },
  {
    question: "What if there’s no electricity during the service?",
    answer:
      "If there's no electricity, you can easily reschedule the service through Urban Company’s customer support.",
  },
];

export default function Faqs({
  title = "Frequently asked questions",
  className,
  titleClass,
  faqs = [],
  replace = false,
}) {
  const finalFaqs = replace ? faqs : [...staticFaqs, ...faqs];
  return (
    <div className={cn("p-6", className)}>
      <h3 className={cn("font-bold text-foreground-primary", titleClass)}>
        {title}
      </h3>
      <Accordion type="single" collapsible>
        {finalFaqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
