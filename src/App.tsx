import { useEffect, useRef, useState, useCallback } from "react";
import Loader from "./components/Loader";
import Signature from "./components/Signature";
import CosmosCanvas from "./components/CosmosCanvas";
import TopBar, { type NavTarget } from "./components/TopBar";
import Panels, { type PanelState } from "./components/Panels";
import { projects, profile } from "./data/resume";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState<PanelState>(null);
  const [hud, setHud] = useState<{ title: string; cat: string; x: number; y: number } | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [introTrigger, setIntroTrigger] = useState(0);

  const distRef = useRef(0);
  const targetRef = useRef(0);
  const animRef = useRef<{ from: number; to: number; t0: number; dur: number } | null>(null);
  const velRef = useRef(0);

  const tween = useCallback((to: number, dur = 1400) => {
    animRef.current = { from: distRef.current, to, t0: performance.now(), dur };
  }, []);

  // Wheel and Touch navigation listeners (with smooth physics)
  useEffect(() => {
    let closeAcc = 0;

    const push = (dy: number) => {
      if (panel) {
        closeAcc += Math.abs(dy);
        if (closeAcc < 120) return;
        setPanel(null);
      }
      closeAcc = 0;
      if (animRef.current) animRef.current = null;
      targetRef.current = Math.max(0, targetRef.current + dy);
    };

    const onWheel = (e: WheelEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(".box, .mnav")) return;
      e.preventDefault();

      // Normalize wheel delta (original SPEED = 0.55)
      let rawDy = e.deltaY;
      if (e.deltaMode === 1) rawDy *= 32;
      else if (e.deltaMode === 2) rawDy *= window.innerHeight;

      push(rawDy * 0.55);
    };

    let startY: number | null = null;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(".box, .mnav")) return;
      startY = e.touches[0].clientY;
      startTime = performance.now();
      velRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(".box, .mnav")) return;
      if (startY === null) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      const now = performance.now();
      const dy = (startY - y) * 1.5;
      push(dy);
      velRef.current = (dy / Math.max(8, now - startTime)) * 16;
      startY = y;
      startTime = now;
    };

    const onTouchEnd = () => {
      startY = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement && document.activeElement.closest("input, textarea")) return;
      if (e.key === "Escape") {
        setPanel(null);
      } else if (e.key === "Home") {
        setPanel(null);
        tween(0, 1500);
        setIntroTrigger((c) => c + 1);
      } else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        push(160);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        push(-160);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [panel, tween]);

  // Update body classes for away, far, boxed, side
  const handleStateChange = useCallback(
    ({ away, far, currentIdx }: { away: boolean; far: boolean; currentIdx: number }) => {
      document.body.classList.toggle("away", away);
      document.body.classList.toggle("far", far);
      setActiveIdx(currentIdx);
    },
    []
  );

  useEffect(() => {
    const isBoxed = panel !== null;
    const isSide = panel?.kind === "about" || panel?.kind === "contact";
    document.body.classList.toggle("boxed", isBoxed);
    document.body.classList.toggle("side", isSide);
  }, [panel]);

  const handleNav = (target: NavTarget) => {
    if (target === "home") {
      setPanel(null);
      tween(0, 1500);
      setIntroTrigger((c) => c + 1);
    } else if (target === "work") {
      setPanel(null);
      tween(distRef.current > 150 ? distRef.current + 1100 : 900, 1600);
    } else if (target === "selected") {
      setPanel({ kind: "selected" });
    } else if (target === "about") {
      setPanel({ kind: "about" });
    } else if (target === "contact") {
      setPanel({ kind: "contact" });
    }
  };

  const currentProject = projects[activeIdx] || projects[0];

  return (
    <>
      {/* Intro Loader */}
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {/* Signature layer */}
      <Signature />

      {/* 3D Canvas */}
      <CosmosCanvas
        distRef={distRef}
        targetRef={targetRef}
        animRef={animRef}
        velRef={velRef}
        introTrigger={introTrigger}
        onOpenProject={(idx) => setPanel({ kind: "project", index: idx })}
        onHover={setHud}
        onStateChange={handleStateChange}
      />

      {/* Top Bar Navigation */}
      <TopBar onNav={handleNav} />

      {/* Hero Section */}
      <section className="hero" id="intro">
        <div className="hero-row">
          <p className="lead">
            Full Stack Developer specializing in React.js, Next.js, Node.js, and Express.js with robust database architecture. Building high-performance production systems, healthcare platforms, and e-commerce solutions. Scroll to fly through the work.
          </p>
          <button
            type="button"
            className="start"
            id="start"
            onClick={() => tween(distRef.current + 1200, 1600)}
          >
            <span>Explore the work</span>
            <i aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16">
                <path
                  d="M8 2v11M3.5 8.5 8 13l4.5-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </i>
          </button>
        </div>

        <h1 className="bigname" id="bigname" aria-label="Anil Sahu">
          <svg className="namesvg" viewBox="0 0 1600 240" fill="currentColor">
            <text
              x="0"
              y="195"
              fontFamily="'Instrument Serif', 'Times New Roman', Georgia, serif"
              fontStyle="italic"
              fontSize="240"
              fontWeight="400"
              letterSpacing="-0.035em"
            >
              Anil Sahu
            </text>
          </svg>
          <svg className="namesvg-stack" viewBox="0 0 800 440" fill="currentColor">
            <text
              x="0"
              y="190"
              fontFamily="'Instrument Serif', 'Times New Roman', Georgia, serif"
              fontStyle="italic"
              fontSize="210"
              fontWeight="400"
              letterSpacing="-0.035em"
            >
              Anil
            </text>
            <text
              x="0"
              y="390"
              fontFamily="'Instrument Serif', 'Times New Roman', Georgia, serif"
              fontStyle="italic"
              fontSize="210"
              fontWeight="400"
              letterSpacing="-0.035em"
            >
              Sahu
            </text>
          </svg>
        </h1>
      </section>

      {/* While Flying HUD Bar (Image 3) */}
      <div className="flybar">
        <button
          className="now"
          id="now"
          type="button"
          onClick={() => setPanel({ kind: "project", index: activeIdx })}
          aria-live="polite"
        >
          <span className="now-i" id="now-i">
            {String(activeIdx + 1).padStart(3, "0")}
          </span>
          <span className="now-txt">
            <span className="now-t" id="now-t">
              {currentProject.name}
            </span>
            <span className="now-s" id="now-s">
              {currentProject.tech.join(" · ")}
            </span>
          </span>
        </button>

        <div className="flyright">
          <span id="seen">{`${activeIdx + 1} of ${projects.length} works`}</span>
          <button
            id="back"
            type="button"
            onClick={() => {
              tween(0, 1500);
              setIntroTrigger((c) => c + 1);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 6.5A5 5 0 1 1 3 9.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M3.2 2.8v3.9h3.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </button>
        </div>
      </div>

      {/* Floating HUD Tooltip when hovering over a 3D card */}
      {hud && (
        <div className="hud" style={{ left: `${hud.x}px`, top: `${hud.y}px` }}>
          <span>{hud.title}</span>
        </div>
      )}

      {/* Social links (bottom-right, visible when About or Contact is open) */}
      <div className="social" id="social">
        <span className="k">Elsewhere:</span>
        <span className="v">
          {profile.socials.map((s, idx) => (
            <span key={s.label}>
              {idx > 0 && ", "}
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </span>
      </div>

      {/* Left Glass Drawer / Modals */}
      <Panels
        panel={panel}
        onClose={() => setPanel(null)}
        onOpenProject={(idx) => setPanel({ kind: "project", index: idx })}
        onContact={() => setPanel({ kind: "contact" })}
        onFlyAll={() => {
          setPanel(null);
          tween(distRef.current + 1800, 1800);
        }}
      />
    </>
  );
}
