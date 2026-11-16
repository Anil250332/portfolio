import { useEffect, useState } from "react";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t0 = performance.now();
    const dur = 1600;

    const frame = () => {
      const p = Math.min(1, (performance.now() - t0) / dur);
      // smooth cubic ease
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setProgress(eased);

      if (p >= 1) {
        setTimeout(() => {
          setDone(true);
          setTimeout(onDone, 550);
        }, 150);
      } else {
        requestAnimationFrame(frame);
      }
    };

    const raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className={`loader ${done ? "done" : ""}`} aria-label="Loading">
      <svg className="ld-mark" width="84" height="84" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="60" height="60" rx="16" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />
        <path
          d="M16 48 L32 16 L48 48 M23 36 H41"
          stroke="#f2f2f2"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 120,
            strokeDashoffset: Math.max(0, 120 * (1 - progress)),
            transition: "stroke-dashoffset 0.08s linear",
          }}
        />
      </svg>
      <b style={{ "--p": progress } as React.CSSProperties} />
      <span>Anil Sahu</span>
    </div>
  );
}
