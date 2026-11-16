import { useState } from "react";
import type { FormEvent } from "react";
import { profile, budgetOptions, needOptions } from "../data/resume";
import { Reveal, SectionTitle } from "./primitives";
import { AvatarArrow } from "./icons";

type Field = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const empty: Field = { name: "", email: "", company: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<Field>(empty);
  const [need, setNeed] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const toggleNeed = (v: string) =>
    setNeed((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email and a couple of lines about the project.");
      return;
    }
    const subject = encodeURIComponent(`Project inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nNeed: ${need.join(", ") || "—"}\nBudget: ${budget || "—"}\n\n${form.message}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-white/[0.05] px-3.5 py-2.5 text-[14.5px] text-ink outline-none transition focus:border-white/45 focus:bg-white/[0.08] placeholder:text-faint";

  return (
    <section id="contact" className="section-pad">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs tracking-wide text-mute">Start a project</p>
          <SectionTitle className="mt-3">Tell me what you're building.</SectionTitle>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">
            A few lines are enough. I read every brief myself and reply within a day.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass glass-raise mt-10 p-6 sm:p-8">
            {sent ? (
              <div>
                <h3 className="font-serif text-3xl italic text-ink">Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}.</h3>
                <p className="mt-3 text-[15px] text-ink-dim">
                  Your email draft has opened — just hit send. I'll get back to you
                  within a day.
                </p>
                <button onClick={() => setSent(false)} className="pill pill-ghost mt-6 px-5 py-2.5 text-sm text-ink">
                  Send another brief
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-mute">Name</span>
                    <input
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-mute">Email</span>
                    <input
                      className={inputCls}
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-xs text-mute">Company or website</span>
                  <input
                    className={inputCls}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Optional"
                    autoComplete="organization"
                  />
                </label>

                <fieldset className="flex flex-col gap-3">
                  <legend className="text-xs text-mute">What do you need?</legend>
                  <div className="flex flex-wrap gap-2">
                    {needOptions.map((o) => {
                      const on = need.includes(o);
                      return (
                        <button
                          key={o}
                          type="button"
                          onClick={() => toggleNeed(o)}
                          className={`rounded-full border px-3.5 py-2 text-[13px] transition ${
                            on
                              ? "border-white bg-white text-black"
                              : "border-line bg-white/[0.04] text-ink-dim hover:border-white/35"
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset className="flex flex-col gap-3">
                  <legend className="text-xs text-mute">Budget</legend>
                  <div className="flex flex-wrap gap-2">
                    {budgetOptions.map((o) => {
                      const on = budget === o;
                      return (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setBudget(o)}
                          className={`rounded-full border px-3.5 py-2 text-[13px] transition ${
                            on
                              ? "border-white bg-white text-black"
                              : "border-line bg-white/[0.04] text-ink-dim hover:border-white/35"
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="flex flex-col gap-2">
                  <span className="text-xs text-mute">About the project</span>
                  <textarea
                    className={`${inputCls} min-h-[92px] resize-none`}
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What you're building, what you need and when."
                  />
                </label>

                {error && <p className="text-[13px] text-[#ff9b92]">{error}</p>}

                <div className="mt-1 flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    className="pill pill-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-medium"
                  >
                    Send the brief <AvatarArrow />
                  </button>
                  <span className="text-[13px] text-mute">
                    Or write to{" "}
                    <a href={`mailto:${profile.email}`} className="link-underline text-ink">
                      {profile.email}
                    </a>
                  </span>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
