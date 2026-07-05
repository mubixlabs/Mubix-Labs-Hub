import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} support, sales, or general inquiries.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Contact</h1>
      <p className="mt-3 text-muted-foreground">
        Questions about a product, licensing, or partnerships? Send us a message and we&apos;ll
        get back to you within 2 business days.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <a
          href={`mailto:${siteConfig.contact.support}`}
          className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
        >
          <p className="font-semibold text-foreground">Support</p>
          <p className="mt-1 text-muted-foreground">{siteConfig.contact.support}</p>
        </a>
        <a
          href={`mailto:${siteConfig.contact.hello}`}
          className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
        >
          <p className="font-semibold text-foreground">General / Press</p>
          <p className="mt-1 text-muted-foreground">{siteConfig.contact.hello}</p>
        </a>
      </div>

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
