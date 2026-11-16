import { profile } from "../data/resume";
import { Label, Reveal, SectionTitle } from "./primitives";

export default function About() {
  return (
    <section id="about" className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="text-xs tracking-wide text-mute">About</p>
          <SectionTitle className="mt-3">
            I build for founders who are building something new.
          </SectionTitle>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-dim">
            I'm Anil. I started as a fresher teaching myself the MERN stack, and I
            never stopped. Today I ship production web applications for real clients —
            e-commerce stores, school and healthcare platforms, and admin dashboards —
            owning everything from database design and REST APIs to deployment, SEO and
            ongoing support.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
            Most of my clients are small businesses and startups, usually right before a
            launch, a rebrand, or around the corner from their next growth phase.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            <div className="border-b border-line py-5 pr-6">
              <Label>Apps shipped</Label>
              <div className="mt-1 font-serif text-5xl italic text-ink">10+</div>
            </div>
            <div className="border-b border-line py-5 sm:border-l sm:pl-6">
              <Label>Years building</Label>
              <div className="mt-1 font-serif text-5xl italic text-ink">2+</div>
            </div>
            <div className="border-b border-line py-5 sm:border-b-0">
              <Label>Primary stack</Label>
              <div className="mt-1 text-sm leading-relaxed text-ink">
                React · Next.js
                <br />
                Node.js · Express
                <br />
                MongoDB · MySQL
              </div>
            </div>
            <div className="border-b border-line py-5 sm:border-b-0 sm:border-l sm:pl-6">
              <Label>Elsewhere</Label>
              <div className="mt-2 flex flex-col gap-1.5 text-sm">
                {profile.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline w-fit text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
