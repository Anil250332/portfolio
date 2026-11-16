import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  projects,
  profile,
  experiences,
  education,
  skillCategories,
  budgetOptions,
  needOptions,
  type Project,
} from "../data/resume";
import { workImage } from "./art";

export type PanelState =
  | null
  | { kind: "selected" }
  | { kind: "project"; index: number }
  | { kind: "about" }
  | { kind: "contact" };

export default function Panels({
  panel,
  onClose,
  onOpenProject,
  onContact,
  onFlyAll,
}: {
  panel: PanelState;
  onClose: () => void;
  onOpenProject: (index: number) => void;
  onContact: () => void;
  onFlyAll: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [toastText, setToastText] = useState("");

  // Contact form state
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [need, setNeed] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const toggleNeed = (v: string) =>
    setNeed((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const handleCopyLink = (proj: Project) => {
    const url = `${window.location.origin}/?work=${encodeURIComponent(proj.name.toLowerCase().replace(/\s+/g, "-"))}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setToastText("Link copied");
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setToastText(""), 2200);
    });
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErr("Please add your name, a valid email and a few lines about the project.");
      return;
    }
    setErr("");
    const subject = encodeURIComponent(`Project brief from ${form.name}${form.company ? ` (${form.company})` : ""}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || "—"}\nNeeds: ${need.join(", ") || "—"}\nBudget: ${budget || "—"}\n\n${form.message}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const viewKind = panel ? (panel.kind === "project" ? "project" : panel.kind) : "closed";
  const activeProject = panel && panel.kind === "project" ? projects[panel.index] : null;
  const projectIdx = panel && panel.kind === "project" ? panel.index : 0;

  return (
    <>
      <aside className="box" id="box" data-view={viewKind}>
        {/* Project View */}
        <section className="view v-project" aria-labelledby="p-title">
          <div className="v-head">
            <button type="button" className="back-link" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Close</span>
            </button>
            <div className="v-acts">
              {activeProject && (
                <button
                  type="button"
                  className={`back-link copy-link ${copied ? "done" : ""}`}
                  onClick={() => handleCopyLink(activeProject)}
                  aria-label="Copy a link to this work"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6.6 9.4a2.8 2.8 0 0 0 4 0l2.2-2.2a2.8 2.8 0 0 0-4-4l-.9.9M9.4 6.6a2.8 2.8 0 0 0-4 0L3.2 8.8a2.8 2.8 0 0 0 4 4l.9-.9" />
                  </svg>
                  <span>{copied ? "Link copied" : "Copy link"}</span>
                </button>
              )}
              {activeProject && (
                <a className="link" href={activeProject.url} target="_blank" rel="noopener noreferrer">
                  Visit live site <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>

          {activeProject && (
            <div className="p-scroll p-fit" id="p-scroll">
              <p className="p-kind">
                <span>{activeProject.tech.join(" · ")}</span>
              </p>
              <h2 id="p-title">{activeProject.name}</h2>
              <p className="desc" id="p-desc">{activeProject.description}</p>
              
              <ul className="tags">
                {activeProject.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <div className="stage" id="p-stage">
                <img src={workImage(projectIdx)} alt={activeProject.name} />
              </div>

              <aside className="p-cta" aria-label="Start a project">
                <div className="p-cta-txt">
                  <p className="p-cta-k">Have something in mind?</p>
                  <h3 className="p-cta-t">Let's make the next one yours.</h3>
                </div>
                <div className="p-cta-row">
                  <button type="button" className="p-cta-btn" onClick={onContact}>
                    Start a project
                  </button>
                  <a className="p-cta-alt" href={activeProject.url} target="_blank" rel="noopener noreferrer">
                    Visit live site
                  </a>
                </div>
              </aside>
            </div>
          )}
        </section>

        {/* Selected Work List View */}
        <section className="view v-selected" aria-labelledby="selected-title">
          <div className="v-head">
            <button type="button" className="back-link" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Close</span>
            </button>
            <p className="src">Selected work</p>
          </div>
          <div className="p-scroll">
            <h2 id="selected-title">A few to start with.</h2>
            <p className="body">
              Full products built end to end — e-commerce, healthcare, education and CMS. Pick one and the flight takes you straight to it.
            </p>

            <ol className="sel-list">
              {projects.map((p, i) => (
                <li key={p.name}>
                  <button type="button" className="sel-item" onClick={() => onOpenProject(i)}>
                    <div className="thumb">
                      <img src={workImage(i)} alt="" loading="lazy" />
                    </div>
                    <span>
                      <span className="t">{p.name}</span>
                      <span className="k">{p.tech.join(" · ")}</span>
                    </span>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  </button>
                </li>
              ))}
            </ol>

            <p className="sel-foot">
              Or <button type="button" className="sel-all" onClick={onFlyAll}>fly through everything</button>, 10+ shipped web applications in chronological order.
            </p>
          </div>
        </section>

        {/* About View */}
        <section className="view v-about" aria-labelledby="about-title">
          <div className="v-head">
            <button type="button" className="back-link" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Close</span>
            </button>
            <p className="src">About</p>
          </div>
          <div className="p-scroll">
            <h2 id="about-title">I build for founders who are building something new.</h2>
            <p className="body">
              I'm Anil. I started teaching myself full-stack web development and never stopped. Today I work as a Full Stack Developer at <a href="https://github.com/Anil250332" target="_blank" rel="noopener">ADRYTER</a>, building fast, production-ready web applications — e-commerce, school and healthcare platforms, and admin dashboards — owning everything from database schema and REST APIs to deployment, SSR, SEO, and ongoing maintenance.
            </p>
            <p className="body">
              Most of my clients are startups and growing businesses right before a launch, an expansion, or their next major milestone.
            </p>

            <div className="facts">
              <div>
                <p className="label">Work Experience</p>
                {experiences.map((exp) => (
                  <p key={exp.company}>
                    <strong>{exp.company}</strong> — {exp.role} <span style={{ color: "var(--mute)", fontSize: 13 }}>({exp.period})</span>
                  </p>
                ))}
              </div>
              <div>
                <p className="label">Education</p>
                {education.map((edu) => (
                  <p key={edu.school}>
                    <strong>{edu.school}</strong><br />
                    <span style={{ color: "var(--mute)", fontSize: 13 }}>{edu.degree} · {edu.period}</span>
                  </p>
                ))}
              </div>
              <div>
                <p className="label">Primary Stack</p>
                <p>
                  {skillCategories[0].items.slice(0, 3).join(", ")}, {skillCategories[1].items.slice(0, 3).join(", ")}, {skillCategories[2].items.slice(0, 3).join(", ")}, MongoDB, MySQL.
                </p>
              </div>
              <div>
                <p className="label">Elsewhere</p>
                <p>
                  {profile.socials.map((s, idx) => (
                    <span key={s.label}>
                      {idx > 0 && ", "}
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <aside className="p-cta" style={{ marginTop: "auto" }}>
              <div className="p-cta-txt">
                <p className="p-cta-k">Have something in mind?</p>
                <h3 className="p-cta-t">Let's make the next one yours.</h3>
              </div>
              <div className="p-cta-row">
                <button type="button" className="p-cta-btn" onClick={onContact}>
                  Start a project
                </button>
              </div>
            </aside>
          </div>
        </section>

        {/* Contact / Start a Project View */}
        <section className="view v-contact" aria-labelledby="c-title">
          <div className="v-head">
            <button type="button" className="back-link" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Close</span>
            </button>
            <p className="src">Start a project</p>
          </div>
          <div className="p-scroll">
            {!sent ? (
              <form className="cform" onSubmit={handleContactSubmit} noValidate>
                <h2 id="c-title">Tell me what you're building.</h2>
                <p className="c-sub">A few lines are enough. I read every brief myself and reply within a day.</p>

                <div className="c-row">
                  <label className="field">
                    <span>Name</span>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <label className="field">
                  <span>Company or website</span>
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    autoComplete="organization"
                  />
                </label>

                <fieldset className="field">
                  <legend>What do you need?</legend>
                  <div className="chips">
                    {needOptions.map((opt) => (
                      <label key={opt} className="chip">
                        <input
                          type="checkbox"
                          checked={need.includes(opt)}
                          onChange={() => toggleNeed(opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="field">
                  <legend>Budget</legend>
                  <div className="chips">
                    {budgetOptions.map((opt) => (
                      <label key={opt} className="chip">
                        <input
                          type="radio"
                          name="budget"
                          checked={budget === opt}
                          onChange={() => setBudget(opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="field">
                  <span>About the project</span>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What the company does, what you need and when."
                    required
                  />
                </label>

                {err && <p style={{ color: "#ff9b92", fontSize: 13 }}>{err}</p>}

                <div className="c-foot">
                  <button type="submit" className="p-cta-btn">
                    Send the brief
                  </button>
                  <p className="c-note">
                    Or write directly to{" "}
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </p>
                </div>
              </form>
            ) : (
              <div className="c-done">
                <h2>Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}.</h2>
                <p className="c-sub">Your email app has been opened with your brief filled in. Just hit send and I'll reply within a day.</p>
                <button type="button" className="p-cta-alt" onClick={() => setSent(false)}>
                  Send another brief
                </button>
              </div>
            )}
          </div>
        </section>
      </aside>

      {/* Copy link confirmation toast */}
      <div className={`copy-toast ${toastText ? "on" : ""}`}>{toastText}</div>
    </>
  );
}
