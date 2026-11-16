import { education } from "../data/resume";
import { Label, Reveal, SectionTitle } from "./primitives";

export default function Education() {
  return (
    <section id="education" className="section-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs tracking-wide text-mute">Education</p>
          <SectionTitle className="mt-3">Academic background.</SectionTitle>
        </Reveal>

        <div className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
          {education.map((edu, i) => (
            <Reveal key={edu.school} delay={i * 0.08}>
              <div>
                <h3 className="font-serif text-3xl italic leading-tight text-ink">
                  {edu.school}
                </h3>
                <p className="mt-3 text-[15px] text-ink-dim">{edu.degree}</p>
                <div className="mt-3">
                  <Label>{edu.period}</Label>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
