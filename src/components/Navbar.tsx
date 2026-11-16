import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "../data/resume";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "bg-transparent"
      }`}
      style={{ padding: "clamp(16px,2vw,32px)", paddingBottom: "8px" }}
    >
      <div className="flex items-center justify-between gap-4">
        <a href="#home" className="link-underline flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-line font-serif text-lg italic text-ink">
            {profile.firstName.charAt(0)}
          </span>
          <span className="hidden font-serif text-xl italic text-ink sm:inline">
            {profile.firstName} <span className="not-italic text-mute">/</span> {profile.role}
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="link-underline text-sm text-ink-dim hover:text-ink">
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="pill pill-primary px-4 py-2 text-sm font-medium"
          >
            Hire me
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="glass glass-raise mt-4 p-5 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl italic leading-tight text-ink hover:opacity-70"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="pill pill-primary mt-3 w-fit px-5 py-2.5 text-sm font-medium"
            >
              Hire me
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
