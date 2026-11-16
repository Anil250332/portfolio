import { skillCategories } from "../data/resume";
import { Reveal, SectionTitle } from "./primitives";

export default function Skills() {
  return (
    <section id="skills" className="section-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs tracking-wide text-mute">Skills</p>
          <SectionTitle className="mt-3">The tools I work with.</SectionTitle>
        </Reveal>

        <div className="mt-12 grid gap-x-12 gap-y-10 border-t border-line pt-10 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.title} delay={(i % 3) * 0.06}>
              <div>
                <h3 className="font-serif text-2xl italic text-ink">{cat.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink-dim"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
