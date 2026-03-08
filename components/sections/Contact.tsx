"use client";

import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";
import { copy, personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionHeading label="06 - Contact" title="Contact" />

        <AnimateOnScroll direction="left">
          <article className="mx-auto max-w-3xl rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-6 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white">{copy.contactCopy.heading}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#C8C8E8]">{copy.contactCopy.message}</p>

            <ul className="mt-6 space-y-4 text-sm text-[#C8C8E8]">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <a href={`mailto:${personal.email}`} className="break-all hover:text-white">
                  {personal.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <a href={`tel:${personal.phone}`} className="break-all hover:text-white">
                  {personal.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span>{personal.location}</span>
              </li>
            </ul>

            <div className="mt-6 flex gap-3">
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2A50] bg-[#13132A] text-[#C8C8E8] transition-colors hover:border-blue-500 hover:text-white"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </article>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
