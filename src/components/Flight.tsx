import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { projects, type Project } from "../data/resume";
import { workImage } from "./art";

/**
 * A true live 3D flight corridor, drawn on canvas — inspired by the
 * "fly through the work" cosmos on vadimcarazan.com.
 *
 * The camera sits inside a field of floating works and particles. Scrolling
 * moves the camera forward through depth; works approach, grow, pass you and
 * recycle. There is always gentle ambient motion, plus mouse parallax.
 */

const COUNT = projects.length;
const LANE_STEP = 880; // depth between consecutive main works
const PERSP = 1280; // projection distance
const MAIN_H = 760; // world height of a main card
const TOTAL_DEPTH = COUNT * LANE_STEP + 1400; // camera travel across the section

const GHOSTS = 30;
const PARTICLES = 150;
const G_DEPTH = 17000; // depth of the ambient field

type Ghost = { x: number; y: number; z: number; h: number; img: HTMLImageElement; tw: number };
type Particle = { x: number; y: number; z: number; r: number; a: number; tw: number };

function loadImage(src: string): HTMLImageElement {
  const im = new Image();
  im.src = src;
  return im;
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
function seeded(i: number) {
  let s = i * 16807 % 2147483647 + 11;
  return () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
}

export default function Flight() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);

  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setActive(clamp(Math.floor(v * COUNT), 0, COUNT - 1));
  });

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const canvas = cv;
    const g = ctx;

    let W = 0;
    let H = 0;
    let DPR = 1;
    let raf = 0;
    let t0 = performance.now();

    // main works
    const mains = projects.map((p: Project, i: number) => ({
      i,
      p,
      img: loadImage(workImage(i)),
    }));

    // ambient ghost tiles
    const ghosts: Ghost[] = [];
    for (let j = 0; j < GHOSTS; j++) {
      const r = seeded(j + 100);
      const ang = r() * Math.PI * 2;
      const rad = 260 + r() * 1100;
      ghosts.push({
        x: Math.cos(ang) * rad,
        y: Math.sin(ang) * rad * 0.85,
        z: -(300 + r() * G_DEPTH),
        h: 120 + r() * 340,
        img: loadImage(workImage(50 + j)),
        tw: r() * Math.PI * 2,
      });
    }

    // particle field
    const particles: Particle[] = [];
    for (let j = 0; j < PARTICLES; j++) {
      const r = seeded(j + 1000);
      const ang = r() * Math.PI * 2;
      const rad = 120 + r() * 1500;
      particles.push({
        x: Math.cos(ang) * rad,
        y: Math.sin(ang) * rad * 0.75,
        z: -(80 + r() * G_DEPTH),
        r: 0.8 + r() * 2.2,
        a: 0.2 + r() * 0.6,
        tw: r() * Math.PI * 2,
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 1.75);
      W = Math.round(rect.width);
      H = Math.round(rect.height);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function draw() {
      const now = performance.now();
      const tt = (now - t0) / 1000;
      const camZ = progressRef.current * TOTAL_DEPTH;
      const px = pointerRef.current.sx;
      const py = pointerRef.current.sy;

      // background
      g.fillStyle = "#0a0a0b";
      g.fillRect(0, 0, W, H);

      type Vis = { d: number; draw: () => void };
      const vis: Vis[] = [];

      const addImage = (
        img: HTMLImageElement,
        x: number,
        y: number,
        z: number,
        w: number,
        h: number,
        alpha: number
      ) => {
        const d = -(z - camZ);
        if (d < 90 || d > 5200) return;
        const s = PERSP / (PERSP + d);
        const cx = W / 2 + (x - px) * s;
        const cy = H / 2 + (y - py) * s;
        const rw = w * s;
        const rh = h * s;
        if (cx + rw < 0 || cx - rw > W || cy + rh < 0 || cy - rh > H) return;
        const far = smoothstep(5200, 2800, d);
        const near = smoothstep(140, 380, d);
        vis.push({ d, draw: () => {
          g.save();
          g.globalAlpha = alpha * far * near;
          g.drawImage(img, cx - rw / 2, cy - rh / 2, rw, rh);
          g.restore();
        } });
      };

      // main lane works (recycle in order)
      for (const m of mains) {
        let k = m.i;
        while (k * LANE_STEP < camZ + 2600) k += COUNT;
        const z = -(k * LANE_STEP);
        const a = smoothstep(2800, 1500, -(z - camZ)) * 0.96;
        addImage(m.img, 0, 0, z, MAIN_H * 4 / 3, MAIN_H, a);
      }

      // ghosts
      for (const g of ghosts) {
        const wob = Math.sin(tt * 0.5 + g.tw) * 40;
        const wob2 = Math.cos(tt * 0.4 + g.tw * 1.3) * 30;
        addImage(g.img, g.x + wob, g.y + wob2, g.z, g.h * 4 / 3, g.h, 0.55);
      }

      // particles
      for (const p of particles) {
        const d = -(p.z - camZ);
        if (d < 60 || d > 6000) continue;
        const s = PERSP / (PERSP + d);
        const cx = W / 2 + (p.x - px) * s;
        const cy = H / 2 + (p.y - py) * s;
        const r = p.r * s * 2;
        const twinkle = 0.7 + 0.3 * Math.sin(tt * 2 + p.tw);
        vis.push({ d, draw: () => {
          g.save();
          g.globalAlpha = p.a * twinkle * smoothstep(6000, 3500, d);
          g.fillStyle = "#f2f2f2";
          g.beginPath();
          g.arc(cx, cy, Math.max(0.4, r), 0, Math.PI * 2);
          g.fill();
          g.restore();
        } });
      }

      // far to near
      vis.sort((a, b) => b.d - a.d);
      for (const v of vis) v.draw();
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="work" ref={wrapRef} className="relative" style={{ height: `${(COUNT + 1) * 120}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-default"
          onPointerMove={(e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            pointerRef.current.x = e.clientX;
            pointerRef.current.y = e.clientY;
            pointerRef.current.sx = nx * 90;
            pointerRef.current.sy = ny * 60;
          }}
        />

        {/* subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(10_10_11/0.7))]" />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-8">
          <div className="flex items-start justify-between">
            <span className="text-xs uppercase tracking-[0.22em] text-mute">Work</span>
            <span className="font-serif text-7xl italic leading-none text-white/15 sm:text-8xl">
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-xs text-mute">Now flying through</div>
              <div className="mt-1 font-serif text-3xl italic text-white sm:text-4xl">
                {projects[active].name}
              </div>
              <div className="mt-1 text-sm text-mute">
                {projects[active].tech.join(" · ")}
              </div>
            </div>
            <a
              href="#selected"
              className="pill pill-ghost pointer-events-auto inline-flex items-center px-4 py-2 text-sm text-ink"
            >
              All work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
