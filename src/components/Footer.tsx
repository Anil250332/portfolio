import { profile } from "../data/resume";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 sm:flex-row sm:px-8">
        <div className="flex items-center gap-3 text-sm text-mute">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line font-serif text-base italic text-ink">
            A
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name}. React · TypeScript · Tailwind.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-ink"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
