import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { projects, type Project } from "../data/resume";
import { workImage } from "./art";
import { Reveal, SectionTitle } from "./primitives";

function Thumb({ project, index }: { project: Project; index: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img src={workImage(index)} alt={project.name} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/25" />
      <span className="absolute right-2.5 top-2 text-[11px] tabular-nums text-white/50">
        0{index + 1}
      </span>
    </div>
  );
}

function ProjectModal({ project, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass glass-raise relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line p-5">
          <button
            onClick={onClose}
            className="pill pill-ghost inline-flex items-center gap-2 px-3 py-2 text-[13px] text-ink"
          >
            <X size={14} /> Close
          </button>
          <span className="text-xs text-mute">
            Project <span className="tabular-nums">0{index + 1}</span>
          </span>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="h-40 overflow-hidden rounded-2xl sm:h-56">
            <Thumb project={project} index={index} />
          </div>

          <h3 className="mt-6 font-serif text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-ink">
            {project.name}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">{project.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-3 py-1 text-xs text-mute"
              >
                {t}
              </span>
            ))}
          </div>

          <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
            {project.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-ink-dim">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
            >
              Visit live site <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-line p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-mute">Have something in mind?</p>
              <p className="mt-1 font-serif text-xl italic text-ink sm:text-2xl">
                Let's make the next one yours.
              </p>
            </div>
            <a
              href="#contact"
              onClick={onClose}
              className="pill pill-primary px-5 py-2.5 text-sm font-medium"
            >
              Start a project
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="work" className="section-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs tracking-wide text-mute">Selected work</p>
          <SectionTitle className="mt-3">
            A few to start with.
          </SectionTitle>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-dim">
            Each one a full product and brand built together — e-commerce, healthcare,
            education and CMS. Pick one and it opens up.
          </p>
        </Reveal>

        <div className="mt-12 border-t border-line">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.04}>
              <button
                onClick={() => setActive(i)}
                className="group flex w-full items-center gap-4 border-b border-line py-5 text-left sm:gap-6 sm:py-6"
              >
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-28">
                  <Thumb project={p} index={i} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-serif text-2xl text-ink transition-opacity group-hover:opacity-70 sm:text-3xl">
                    {p.name}
                  </div>
                  <div className="mt-1 truncate text-[13px] text-mute">
                    {p.tech.join(" · ")}
                  </div>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-mute">
                  0{i + 1}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-sm text-mute">
            Or{" "}
            <a href="#experience" className="link-underline text-ink">
              jump into my experience
            </a>{" "}
            and the tools I use.
          </p>
        </Reveal>
      </div>

      <AnimatePresence>
        {active !== null && (
          <ProjectModal
            project={projects[active]}
            index={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
