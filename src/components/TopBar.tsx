import { useEffect, useState } from "react";

export type NavTarget = "home" | "selected" | "work" | "about" | "contact";

export default function TopBar({
  onNav,
}: {
  onNav: (target: NavTarget) => void;
}) {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date());
        setTime(formatted);
      } catch {
        setTime("IST");
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleNav = (target: NavTarget) => {
    setMenuOpen(false);
    onNav(target);
  };

  return (
    <>
      <header className="topbar">
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="mark"
          aria-label="Anil Sahu, home"
        >
          <svg className="logo" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="60" height="60" rx="16" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />
            <path
              d="M16 48 L32 16 L48 48 M23 36 H41"
              stroke="#f2f2f2"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="col col-go" onClick={() => handleNav("about")} title="About">
          <span className="k">Currently:</span>
          <span className="v">
            Full Stack Developer,{" "}
            <a href="https://github.com/Anil250332" target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
              ADRYTER
            </a>
          </span>
        </div>

        <div className="col col-place col-go" onClick={() => handleNav("about")} title="About">
          <span className="k">Based in:</span>
          <span className="v">
            Gwalior, India (<time className="clock">{time}</time>)
          </span>
        </div>

        <div className="col col-nav">
          <span className="k">Navigation:</span>
          <span className="v">
            <button type="button" onClick={() => handleNav("selected")}>
              Selected
            </button>
            {", "}
            <button type="button" onClick={() => handleNav("work")}>
              Work
            </button>
            {", "}
            <button type="button" onClick={() => handleNav("about")}>
              About
            </button>
            {", "}
            <button type="button" onClick={() => handleNav("contact")}>
              Contact
            </button>
          </span>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mnav"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mnav ${menuOpen ? "open" : ""}`} id="mnav" hidden={!menuOpen}>
        <nav className="mnav-links">
          <button type="button" onClick={() => handleNav("selected")}>
            Selected work
          </button>
          <button type="button" onClick={() => handleNav("work")}>
            Work
          </button>
          <button type="button" onClick={() => handleNav("about")}>
            About
          </button>
          <button type="button" onClick={() => handleNav("contact")}>
            Contact
          </button>
        </nav>
        <p className="mnav-lead">
          MERN stack developer building fast, secure, production-ready web applications — e-commerce, CMS, school and healthcare platforms — from first commit to deployment. Scroll to fly through the work.
        </p>
        <div className="mnav-facts">
          <div>
            <span className="k">Currently:</span>
            <span className="v">Full Stack Developer, ADRYTER</span>
          </div>
          <div>
            <span className="k">Based in:</span>
            <span className="v">
              Gwalior, India (<time className="clock">{time}</time>)
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
