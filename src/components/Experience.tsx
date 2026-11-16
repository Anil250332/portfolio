import { experiences } from "../data/resume";
import { Label, Reveal, SectionTitle } from "./primitives";

export default function Experience() {
  return (
    <section id="experience" className="section-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs tracking-wide text-mute">Experience</p>
          <SectionTitle className="mt-3">Where I've worked.</SectionTitle>
        </Reveal>

        <div className="mt-12 space-y-14 lg:space-y-16">
          {experiences.map((exp, i) => (
            <Reveal key={exp.company} delay={i * 0.08}>
              <article className="border-t border-line pt-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight text-ink">
                      {exp.company}
                    </h3>
                    <p className="mt-1 text-sm text-ink-dim">{exp.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-mute">{exp.period}</div>
                    <Label>{exp.location}</Label>
                  </div>
                </div>

                <ul className="mt-6 space-y-3">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-ink-dim">
                      <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/50" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
