import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { projects } from "../data/resume";
import { createProjectAtlasCanvas, PROJECT_SCREENSHOTS } from "./art";
import portraitData from "../data/portraitCells.json";

const COUNT = projects.length; // 4 core projects

// ── Original vadimcarazan.com LANE constants ──
const LANE = {
  step: 55,   // Distance between consecutive lane cards
  h: 7.5,     // Card height in world units
  x: 12,      // Random X cluster spread
  y: 7,       // Random Y cluster spread
  z0: 270,    // Depth where lane begins
  n: 52,      // Pre-allocated lane cards
  rx: 30,     // Keep-out zone X radius (no atmosphere tiles directly in central lane)
  ry: 22,     // Keep-out zone Y radius
};

const STREAM_R = 95;      // Maximum radial distance for atmosphere corridor
const STREAM_COUNT = 750;  // High-density crystal screenshot tiles in the atmosphere
const STREAM_DEPTH = 2400; // Repeating depth window for infinite seamless streaming
const DUST_COUNT = 380;
const FLOATER_COUNT = 240;
const TOTAL_MAX_INSTANCES = 12000;

type ClickableBox = {
  x0: number; y0: number; x1: number; y1: number;
  title: string; cat: string; projectIndex: number;
};

type PortraitCell = {
  col: number; row: number; depth: number; hs: number; dim: number;
  slot: number; filler: number;
  fromX: number; fromY: number; fromZ: number;
  delay: number; dur: number;
  r: number; g: number; b: number;
};

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

function seeded(i: number) {
  let s = ((i * 16807) % 2147483647) + 11;
  return () => { s = (s * 48271) % 2147483647; return s / 2147483647; };
}

// Exact flow() swirl formula from vadimcarazan.com
function flow(x: number, y: number, t: number): [number, number] {
  return [
    Math.sin(y * 0.045 + t * 0.35) + 0.6 * Math.sin((x + y) * 0.03 - t * 0.27),
    Math.cos(x * 0.045 - t * 0.31) + 0.6 * Math.cos((x - y) * 0.03 + t * 0.23),
  ];
}

// ── WebGL 2 Shaders ──
const VERT_SRC = `#version 300 es
precision highp float;
in vec2 aVertex;
in vec3 aPos;
in vec2 aSize;
in vec4 aUvRect;
in vec4 aColor;
in float aGlint;
in float aType; // 0.0: standard tile, 1.0: stardust, 2.0: card glow halo

uniform mat4 uProj;
uniform vec3 uCamPos;

out vec2 vUv;
out vec2 vLocal;
out vec4 vColor;
out float vGlint;
out float vType;
out float vDepth;

void main() {
  vec3 p = aPos - uCamPos;
  vec3 worldPos = p + vec3(aVertex.x * aSize.x, aVertex.y * aSize.y, 0.0);
  gl_Position = uProj * vec4(worldPos, 1.0);
  vUv = aUvRect.xy + (aVertex + 0.5) * aUvRect.zw;
  vLocal = aVertex + 0.5;
  vColor = aColor;
  vGlint = aGlint;
  vType = aType;
  vDepth = -p.z;
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vLocal;
in vec4 vColor;
in float vGlint;
in float vType;
in float vDepth;

uniform sampler2D uAtlas;
uniform float uTime;

out vec4 fragColor;

// Interleaved gradient noise for Vadim's order-free dissolve
float ign(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

void main() {
  // 1. Stardust particle
  if (vType > 0.5 && vType < 1.5) {
    vec2 c = vLocal - 0.5;
    if (dot(c, c) > 0.25) discard;
    fragColor = vec4(1.0, 1.0, 1.0, vColor.a);
    return;
  }

  // 2. Soft glow halo behind featured cards (Additive feel)
  if (vType > 1.5) {
    vec2 q = (vLocal - 0.5) * vec2(1.0, 1.25);
    float r = length(q) * 2.0;
    float g = exp(-r * r * 4.5) * (1.0 - smoothstep(0.65, 1.0, r));
    float pulse = 0.88 + 0.12 * sin(uTime * 1.5 + vLocal.x * 6.28);
    vec3 haloCol = mix(vec3(0.95, 0.98, 1.0), vColor.rgb, 0.45) * g * pulse * vColor.a * 0.9;
    fragColor = vec4(haloCol, g * vColor.a);
    return;
  }

  // 3. Project Tile / Crystal: 4:3 rounded card (6% border radius)
  vec2 q = abs((vLocal - 0.5) * vec2(1.3333, 1.0)) - vec2(0.6667, 0.5) + 0.06;
  if (length(max(q, 0.0)) > 0.06) discard;

  // Stippled dissolve when approaching camera
  float nearDissolve = smoothstep(12.0, 36.0, vDepth);
  if (nearDissolve < 1.0) {
    if (ign(gl_FragCoord.xy) > nearDissolve) discard;
  }

  vec4 tex = texture(uAtlas, vUv);
  vec3 c = mix(vColor.rgb, tex.rgb, 0.88);

  // Glint band sweeping across case-study cards
  if (vGlint > 0.0) {
    float p = vLocal.x * 0.75 + (1.0 - vLocal.y) * 0.5;
    float band = exp(-pow((p - vGlint) / 0.06, 2.0)) * 0.45 + exp(-pow((p - vGlint - 0.08) / 0.03, 2.0)) * 0.2;
    c = clamp(c + vec3(1.0, 0.98, 0.92) * band, 0.0, 1.0);
  }

  // Crisp card edge highlight
  float edge = min(min(vLocal.x, 1.0 - vLocal.x), min(vLocal.y, 1.0 - vLocal.y));
  if (edge < 0.02) {
    c = mix(c, vec3(0.92, 0.94, 0.98), 0.38);
  }

  fragColor = vec4(c, vColor.a);
}
`;

function createShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function CosmosCanvas({
  distRef, targetRef, animRef, velRef, introTrigger,
  onOpenProject, onHover, onStateChange,
}: {
  distRef: MutableRefObject<number>;
  targetRef: MutableRefObject<number>;
  animRef: MutableRefObject<{ from: number; to: number; t0: number; dur: number } | null>;
  velRef: MutableRefObject<number>;
  introTrigger: number;
  onOpenProject: (index: number) => void;
  onHover: (info: { title: string; cat: string; x: number; y: number } | null) => void;
  onStateChange?: (state: { away: boolean; far: boolean; currentIdx: number }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introStartRef = useRef<number>(performance.now());
  const pointerRef = useRef({
    x: 0, y: 0, sx: 0, sy: 0, in: false,
    down: null as { x: number; y: number; t: number } | null,
  });
  const clickableRef = useRef<ClickableBox[]>([]);

  useEffect(() => { introStartRef.current = performance.now(); }, [introTrigger]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "high-performance" });
    if (!gl) return;

    let W = 0, H = 0, DPR = 1, raf = 0, lastTime = performance.now();
    const t0 = performance.now();

    // Shaders & Program
    const vs = createShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    // Atlas texture with project screenshots
    const atlasCanvas = createProjectAtlasCanvas();
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);

    // Load real website screenshots async and update texture
    const realImgs: (HTMLImageElement | null)[] = [null, null, null, null];
    PROJECT_SCREENSHOTS.forEach((src, idx) => {
      const im = new Image();
      im.onload = () => {
        realImgs[idx] = im;
        const updatedAtlas = createProjectAtlasCanvas(realImgs);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, updatedAtlas);
        gl.generateMipmap(gl.TEXTURE_2D);
      };
      im.src = src;
    });

    // Geometry: Single billboard quad
    const quadVao = gl.createVertexArray();
    gl.bindVertexArray(quadVao);
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5,-0.5, 0.5,-0.5, -0.5,0.5, 0.5,0.5]), gl.STATIC_DRAW);
    const aVertexLoc = gl.getAttribLocation(prog, "aVertex");
    gl.enableVertexAttribArray(aVertexLoc);
    gl.vertexAttribPointer(aVertexLoc, 2, gl.FLOAT, false, 0, 0);

    // Instanced attributes (15 floats per instance)
    const STRIDE_FLOATS = 15;
    const STRIDE_BYTES = STRIDE_FLOATS * 4;
    const instanceArray = new Float32Array(TOTAL_MAX_INSTANCES * STRIDE_FLOATS);
    const instanceBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuf);
    gl.bufferData(gl.ARRAY_BUFFER, instanceArray.byteLength, gl.DYNAMIC_DRAW);

    const attrs = ["aPos","aSize","aUvRect","aColor","aGlint","aType"];
    const sizes = [3, 2, 4, 4, 1, 1];
    const offsets = [0, 3, 5, 9, 13, 14];
    attrs.forEach((name, i) => {
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, sizes[i], gl.FLOAT, false, STRIDE_BYTES, offsets[i] * 4);
      gl.vertexAttribDivisor(loc, 1);
    });

    const uProjLoc = gl.getUniformLocation(prog, "uProj");
    const uCamPosLoc = gl.getUniformLocation(prog, "uCamPos");
    const uTimeLoc = gl.getUniformLocation(prog, "uTime");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ── Process portrait cells (Halftone bust of the man) ──
    const { D0, cols, rows, cW, cH, cells } = portraitData;
    const rCell = seeded(101);
    const processedCells: PortraitCell[] = cells.map((c, i) => {
      const col = c[0], row = c[1], depth = c[2], hs = c[3], dim = c[4];
      const cr = c[5], cg = c[6], cb = c[7], filler = c[8];
      const k = depth / D0;
      // Start positions distributed 360-degrees around the perimeter
      const a = rCell() * Math.PI * 2;
      const rad = (60 + rCell() * 120) * k;
      const fromX = Math.cos(a) * rad;
      const fromY = Math.sin(a) * rad * 0.85;
      const fromZ = -(depth * (1.4 + rCell() * 1.2));
      // Center cells arrive first
      const distFromCenter = Math.hypot(col - cols / 2, row - rows * 0.42);
      const delay = rCell() * 1500 + distFromCenter * 9;
      const dur = 1300 + rCell() * 900;
      return {
        col, row, depth, hs, dim, slot: i % 16, filler,
        fromX, fromY, fromZ, delay, dur,
        r: cr / 255, g: cg / 255, b: cb / 255,
      };
    });

    // ── Floater motes drifting into the man ──
    const floaterMotes: { tgtIdx: number; speed: number; offset: number; ang: number; rad: number; slot: number }[] = [];
    const rFloat = seeded(777);
    for (let m = 0; m < FLOATER_COUNT; m++) {
      floaterMotes.push({
        tgtIdx: Math.floor(rFloat() * processedCells.length),
        speed: 0.12 + rFloat() * 0.18,
        offset: rFloat(),
        ang: rFloat() * Math.PI * 2,
        rad: 110 + rFloat() * 140,
        slot: Math.floor(rFloat() * 16),
      });
    }

    // ── Atmosphere crystal tiles (Surrounding the flight corridor on both sides) ──
    const streamTiles: { ang: number; rad: number; baseZ: number; w: number; h: number; slot: number }[] = [];
    const rStream = seeded(999);
    for (let i = 0; i < STREAM_COUNT; i++) {
      const ang = rStream() * Math.PI * 2;
      // Keep clear of central lane: rad is between LANE.rx (30) and STREAM_R (95)
      const rad = LANE.rx + (STREAM_R - LANE.rx) * Math.pow(rStream(), 0.8);
      const baseZ = rStream() * STREAM_DEPTH;
      const h = 1.6 + Math.pow(rStream(), 2.0) * 4.4;
      streamTiles.push({
        ang,
        rad,
        baseZ,
        w: (h * 4) / 3,
        h,
        slot: Math.floor(rStream() * 16),
      });
    }

    // ── Stardust particles ──
    const dustParticles: { ang: number; rad: number; baseZ: number; size: number; alpha: number }[] = [];
    const rDust = seeded(12345);
    for (let i = 0; i < DUST_COUNT; i++) {
      const ang = rDust() * Math.PI * 2;
      dustParticles.push({
        ang,
        rad: 18 + rDust() * 110,
        baseZ: rDust() * STREAM_DEPTH,
        size: 0.22 + rDust() * 0.35,
        alpha: 0.25 + rDust() * 0.65,
      });
    }

    // ── Lane card cluster offsets (Vadim's RNG formula) ──
    const laneCluster: { dx: number; dy: number }[] = [];
    const rLane = seeded(42);
    for (let k = 0; k < LANE.n; k++) {
      const a = rLane() * Math.PI * 2;
      const rr = Math.sqrt(rLane());
      laneCluster.push({
        dx: Math.cos(a) * rr * LANE.x,
        dy: Math.sin(a) * rr * LANE.y,
      });
    }

    function resize() {
      const rect = cv!.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 1.75);
      W = Math.round(rect.width) || window.innerWidth;
      H = Math.round(rect.height) || window.innerHeight;
      cv!.width = Math.round(W * DPR);
      cv!.height = Math.round(H * DPR);
      gl!.viewport(0, 0, cv!.width, cv!.height);
    }

    let lastAway = false, lastFar = false, lastIdx = -1;

    // Helper to push one instance
    function emit(
      arr: Float32Array, ptr: number,
      x: number, y: number, z: number,
      w: number, h: number,
      slot: number, r: number, g: number, b: number, a: number,
      glint: number, type: number,
    ): number {
      const slotX = slot % 4;
      const slotY = Math.floor(slot / 4);
      arr[ptr++] = x; arr[ptr++] = y; arr[ptr++] = z;
      arr[ptr++] = w; arr[ptr++] = h;
      arr[ptr++] = slotX * 0.25;
      arr[ptr++] = (3 - slotY) * 0.25;
      arr[ptr++] = 0.25; arr[ptr++] = 0.25;
      arr[ptr++] = r; arr[ptr++] = g; arr[ptr++] = b; arr[ptr++] = a;
      arr[ptr++] = glint;
      arr[ptr++] = type;
      return ptr;
    }

    function draw() {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const tt = (now - t0) / 1000;

      // Smooth camera interpolation (Vadim's exact formula: 1 - exp(-dt * 4))
      const anim = animRef.current;
      if (anim) {
        const p = Math.min(1, (now - anim.t0) / anim.dur);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        distRef.current = anim.from + (anim.to - anim.from) * e;
        targetRef.current = distRef.current;
        if (p >= 1) animRef.current = null;
      } else {
        if (Math.abs(velRef.current) > 0.1) {
          targetRef.current = Math.max(0, targetRef.current + velRef.current * (dt * 60));
          velRef.current *= Math.exp(-dt * 3.5);
        }
        distRef.current += (targetRef.current - distRef.current) * (1 - Math.exp(-dt * 4));
        if (Math.abs(targetRef.current - distRef.current) < 0.01) distRef.current = targetRef.current;
      }

      const camZ = distRef.current;

      // Pointer parallax smoothing
      const ptrObj = pointerRef.current;
      ptrObj.sx += (ptrObj.x - ptrObj.sx) * (1 - Math.exp(-dt * 4.5));
      ptrObj.sy += (ptrObj.y - ptrObj.sy) * (1 - Math.exp(-dt * 4.5));
      const px = (ptrObj.sx / W - 0.5) * 2;
      const py = (ptrObj.sy / H - 0.5) * 2;

      // State toggles (away at dist > 8, far at dist > 55)
      const away = camZ > 8;
      const far = camZ > 55;
      // Calculate active lane card index (next piece ahead)
      const activeK = Math.max(0, Math.ceil((camZ + 28 - LANE.z0) / LANE.step));
      const currentIdx = activeK % COUNT;

      if (away !== lastAway || far !== lastFar || currentIdx !== lastIdx) {
        lastAway = away; lastFar = far; lastIdx = currentIdx;
        onStateChange?.({ away, far, currentIdx });
      }

      // Perspective projection matrix (FOV 40 degrees, near 0.1, far 8000)
      const fovRad = (40 * Math.PI) / 180;
      const aspect = W / H;
      const near = 0.1, farDist = 8000;
      const f = 1 / Math.tan(fovRad / 2);
      const nf = 1 / (near - farDist);
      const projMatrix = new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (farDist + near) * nf, -1,
        0, 0, 2 * farDist * near * nf, 0,
      ]);

      gl!.clearColor(7 / 255, 7 / 255, 7 / 255, 1.0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      const camX = px * 0.12;
      const camY = -py * 0.12 + (H > 860 ? -1.2 : -0.8);
      gl!.uniform3f(uCamPosLoc, camX, camY, -camZ);
      gl!.uniformMatrix4fv(uProjLoc, false, projMatrix);
      gl!.uniform1f(uTimeLoc, tt);

      let instanceCount = 0;
      let ptr = 0;

      // ════════════════════════════════════════════
      // 1. CRYSTAL BUST OF THE MAN (Home Section)
      // ════════════════════════════════════════════
      const portraitDispersion = smoothstep(0, 140, camZ);
      const portraitAlpha = 1 - smoothstep(160, 520, camZ);
      const introTime = now - introStartRef.current;
      const isIntroActive = introTime < 4500 && camZ < 8;

      if (portraitAlpha > 0.01) {
        for (let i = 0; i < processedCells.length; i++) {
          const c = processedCells[i];
          if (c.filler && camZ > 60) continue;

          const k = c.depth / D0;
          const targetWx = (c.col + 0.5 - cols / 2) * cW * k;
          const targetWy = (rows / 2 - c.row - 0.5) * cH * k;
          const targetWz = -c.depth;

          let curWx = targetWx, curWy = targetWy, curWz = targetWz;
          let introScale = 1.0, introAlpha = 1.0;

          if (isIntroActive) {
            // Cubic ease-out arrival from around 360 degrees
            const p = Math.min(1, Math.max(0, (introTime - c.delay) / c.dur));
            const e = 1 - Math.pow(1 - p, 3);
            curWx = c.fromX + (targetWx - c.fromX) * e;
            curWy = c.fromY + (targetWy - c.fromY) * e;
            curWz = c.fromZ + (targetWz - c.fromZ) * e;
            introScale = 0.35 + 0.65 * e;
            introAlpha = Math.min(1, 0.2 + p * 1.5);
          } else if (camZ < 60) {
            // Halo float waves around silhouette
            const [fx, fy] = flow(targetWx * 8, targetWy * 8, tt);
            curWx = targetWx + fx * 0.25 * k;
            curWy = targetWy + fy * 0.25 * k;
          }

          if (portraitDispersion > 0 && !isIntroActive) {
            const rad = Math.hypot(targetWx, targetWy);
            const ang = Math.atan2(targetWy, targetWx);
            const scatterRad = rad * (1 + portraitDispersion * 4.5);
            const scatterAng = ang + portraitDispersion * 1.6;
            curWx = Math.cos(scatterAng) * scatterRad;
            curWy = Math.sin(scatterAng) * scatterRad;
          }

          const d = -curWz - camZ;
          if (d <= 12) continue;

          const baseTileH = cH * k * 0.94 * c.hs * introScale * (1 + portraitDispersion * 2.2);
          const baseTileW = baseTileH * (cW / cH);

          const nearFade = smoothstep(12, 45, d);
          const farFade = 1 - smoothstep(600, 1500, d) * portraitDispersion;
          const fillerFade = c.filler ? 1 - smoothstep(0, 55, camZ) : 1;
          const a = portraitAlpha * c.dim * nearFade * farFade * fillerFade * introAlpha;
          if (a <= 0.01) continue;

          ptr = emit(instanceArray, ptr, curWx, curWy, curWz, baseTileW, baseTileH,
            c.slot, c.r, c.g, c.b, a, 0, 0);
          instanceCount++;
        }

        // ── Continuous Motes drifting into the bust from the dark ──
        if (portraitAlpha > 0.08 && !isIntroActive) {
          for (let m = 0; m < floaterMotes.length; m++) {
            const fl = floaterMotes[m];
            const tgt = processedCells[fl.tgtIdx];
            const k = tgt.depth / D0;
            const u = (tt * fl.speed + fl.offset) % 1.0;
            const out = Math.pow(1.0 - u, 1.6);

            const [fx, fy] = flow(
              Math.cos(fl.ang) * fl.rad * out,
              Math.sin(fl.ang) * fl.rad * out,
              tt
            );

            const fWx = (tgt.col + 0.5 - cols / 2) * cW * k + (Math.cos(fl.ang) * fl.rad + fx * 10) * out * k;
            const fWy = (rows / 2 - tgt.row - 0.5) * cH * k + (Math.sin(fl.ang) * fl.rad * 0.85 + fy * 8) * out * k;
            const fWz = -tgt.depth - out * 35.0;

            const d = -fWz - camZ;
            if (d <= 12) continue;

            const fAlpha = portraitAlpha * Math.min(1, u / 0.22) * (1 - Math.max(0, (u - 0.82) / 0.18) * 0.75);
            if (fAlpha <= 0.02) continue;

            const fSizeH = cH * k * 0.94 * (0.55 + 0.45 * u);
            const fSizeW = fSizeH * (cW / cH);

            ptr = emit(instanceArray, ptr, fWx, fWy, fWz, fSizeW, fSizeH,
              fl.slot, tgt.r, tgt.g, tgt.b, fAlpha, 0, 0);
            instanceCount++;
          }
        }
      }

      // ════════════════════════════════════════════
      // 2. STARDUST PARTICLES (Infinite seamless loop)
      // ════════════════════════════════════════════
      for (let i = 0; i < dustParticles.length; i++) {
        const p = dustParticles[i];
        // Seamless modulo wrapping in Z
        const relZ = (((p.baseZ - camZ) % STREAM_DEPTH + STREAM_DEPTH) % STREAM_DEPTH);
        const worldZ = -(camZ + relZ);
        const d = relZ;
        if (d < 14 || d > STREAM_DEPTH - 40) continue;

        const ang = p.ang + tt * 0.04;
        const wx = Math.cos(ang) * p.rad;
        const wy = Math.sin(ang) * (p.rad * 0.72);

        const farFade = smoothstep(STREAM_DEPTH - 40, STREAM_DEPTH - 600, d);
        const nearFade = smoothstep(14, 42, d);
        const twinkle = 0.6 + 0.4 * Math.sin(tt * 2.2 + i * 1.7);

        instanceArray[ptr++] = wx;
        instanceArray[ptr++] = wy;
        instanceArray[ptr++] = worldZ;
        instanceArray[ptr++] = p.size;
        instanceArray[ptr++] = p.size;
        instanceArray[ptr++] = 0; instanceArray[ptr++] = 0;
        instanceArray[ptr++] = 0.25; instanceArray[ptr++] = 0.25;
        instanceArray[ptr++] = 1; instanceArray[ptr++] = 1; instanceArray[ptr++] = 1;
        instanceArray[ptr++] = p.alpha * twinkle * farFade * nearFade;
        instanceArray[ptr++] = 0;
        instanceArray[ptr++] = 1.0; // Stardust type
        instanceCount++;
      }

      // ════════════════════════════════════════════
      // 3. ATMOSPHERE SIDE CRYSTALS (Infinite corridor stream)
      // ════════════════════════════════════════════
      const tunnelAlpha = smoothstep(14, 75, camZ);
      if (tunnelAlpha > 0.01) {
        for (let i = 0; i < streamTiles.length; i++) {
          const tile = streamTiles[i];
          // Infinite wrapping relative to camZ so it NEVER runs out
          const relZ = (((tile.baseZ - camZ) % STREAM_DEPTH + STREAM_DEPTH) % STREAM_DEPTH);
          const worldZ = -(camZ + relZ);
          const d = relZ;
          if (d < 12 || d > STREAM_DEPTH - 80) continue;

          // Organic floating wobble
          const ang = tile.ang + tt * 0.04;
          const wx = Math.cos(ang) * tile.rad + Math.sin(tt * 0.9 + i) * 1.4;
          const wy = Math.sin(ang) * (tile.rad * 0.72) + Math.cos(tt * 0.8 + i) * 1.1;

          const farFade = smoothstep(STREAM_DEPTH - 80, STREAM_DEPTH - 700, d);
          const nearFade = smoothstep(12, 32, d);
          const a = tunnelAlpha * 0.92 * farFade * nearFade;
          if (a < 0.01) continue;

          ptr = emit(instanceArray, ptr, wx, wy, worldZ, tile.w, tile.h,
            tile.slot, 1, 1, 1, a, 0, 0.0);
          instanceCount++;
        }
      }

      // ════════════════════════════════════════════
      // 4. CENTRAL LANE FEATURED PROJECTS (Infinite flight loop)
      // ════════════════════════════════════════════
      const clickables: ClickableBox[] = [];
      const laneAlpha = smoothstep(50, 130, camZ);

      if (laneAlpha > 0.01) {
        // Window of cards currently visible ahead of the viewer
        const currentK = Math.max(0, Math.floor((camZ - LANE.z0) / LANE.step));
        const startK = Math.max(0, currentK - 1);
        const endK = currentK + 22; // Always keep 22 cards ahead, forever!

        for (let k = endK; k >= startK; k--) {
          const cardZ = -(LANE.z0 + k * LANE.step);
          const d = -cardZ - camZ;
          if (d < 16 || d > 800) continue;

          const cluster = laneCluster[k % laneCluster.length];
          const cardX = cluster.dx;
          const cardY = cluster.dy;

          const baseH = LANE.h;
          const baseW = baseH * 1.42;

          const farFade = smoothstep(800, 360, d);
          const nearFade = smoothstep(18, 38, d);
          const cardAlpha = laneAlpha * farFade * nearFade;
          if (cardAlpha < 0.01) continue;

          const projectIdx = k % COUNT;
          const proj = projects[projectIdx];
          const slot = projectIdx * 4;

          // Glint band sweeping across card
          const glintCycle = (tt * 0.38 + k * 0.75) % 2.8;
          const glintVal = glintCycle < 0.9 && nearFade > 0.5 ? glintCycle / 0.9 : 0;

          // ── A. Glow Halo Quad right behind the featured card ──
          if (d < 300) {
            const glowW = baseW * 2.2;
            const glowH = baseH * 2.2;
            const glowAlpha = cardAlpha * (1.0 - smoothstep(160, 280, d));
            if (glowAlpha > 0.01) {
              instanceArray[ptr++] = cardX;
              instanceArray[ptr++] = cardY;
              instanceArray[ptr++] = cardZ - 0.15;
              instanceArray[ptr++] = glowW;
              instanceArray[ptr++] = glowH;
              instanceArray[ptr++] = 0; instanceArray[ptr++] = 0;
              instanceArray[ptr++] = 1; instanceArray[ptr++] = 1;
              instanceArray[ptr++] = 0.85; instanceArray[ptr++] = 0.92; instanceArray[ptr++] = 1.0;
              instanceArray[ptr++] = glowAlpha;
              instanceArray[ptr++] = 0;
              instanceArray[ptr++] = 2.0; // Glow halo type
              instanceCount++;
            }
          }

          // ── B. The Main Project Card ──
          ptr = emit(instanceArray, ptr, cardX, cardY, cardZ, baseW, baseH,
            slot, 1, 1, 1, cardAlpha, glintVal, 0.0);
          instanceCount++;

          // Click detection bounding box projection
          const focal2D = H / (2 * Math.tan(fovRad / 2));
          const s2D = focal2D / d;
          const screenCX = W / 2 + (cardX - camX) * s2D;
          const screenCY = H / 2 - (cardY - camY) * s2D;
          const screenW = baseW * s2D;
          const screenH = baseH * s2D;

          if (screenH > 70 && nearFade > 0.25) {
            clickables.push({
              x0: screenCX - screenW / 2, y0: screenCY - screenH / 2,
              x1: screenCX + screenW / 2, y1: screenCY + screenH / 2,
              title: proj.name, cat: proj.tech.join(" · "),
              projectIndex: projectIdx,
            });
          }
        }
      }

      clickableRef.current = clickables;

      // Upload buffer and draw all instances in ONE SINGLE GPU CALL!
      gl!.bindBuffer(gl!.ARRAY_BUFFER, instanceBuf);
      gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, instanceArray.subarray(0, ptr));
      gl!.bindVertexArray(quadVao);
      gl!.drawArraysInstanced(gl!.TRIANGLE_STRIP, 0, 4, instanceCount);

      // Tooltip Hover check
      if (pointerRef.current.in) {
        const mx = pointerRef.current.x, my = pointerRef.current.y;
        let hovered: ClickableBox | null = null;
        for (let i = clickables.length - 1; i >= 0; i--) {
          const b = clickables[i];
          if (mx >= b.x0 && mx <= b.x1 && my >= b.y0 && my <= b.y1) { hovered = b; break; }
        }
        if (hovered) {
          cv!.classList.add("hot");
          onHover?.({ title: hovered.title, cat: hovered.cat, x: mx, y: my });
        } else { cv!.classList.remove("hot"); onHover?.(null); }
      } else { cv!.classList.remove("hot"); onHover?.(null); }

      raf = requestAnimationFrame(draw);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    resize();

    const onPointerMove = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.in = true;
    };
    const onPointerLeave = () => { pointerRef.current.in = false; onHover?.(null); };
    const onPointerDown = (e: PointerEvent) => {
      pointerRef.current.down = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onPointerUp = (e: PointerEvent) => {
      const d = pointerRef.current.down;
      pointerRef.current.down = null;
      if (!d) return;
      const dx = Math.hypot(e.clientX - d.x, e.clientY - d.y);
      const dt = performance.now() - d.t;
      if (dx < 8 && dt < 450) {
        const rect = cv.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const cl = clickableRef.current;
        for (let i = cl.length - 1; i >= 0; i--) {
          const b = cl[i];
          if (mx >= b.x0 && mx <= b.x1 && my >= b.y0 && my <= b.y1) {
            onOpenProject(b.projectIndex); break;
          }
        }
      }
    };

    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerleave", onPointerLeave);
    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointerup", onPointerUp);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      cv.removeEventListener("pointermove", onPointerMove);
      cv.removeEventListener("pointerleave", onPointerLeave);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointerup", onPointerUp);
    };
  }, [introTrigger, onHover, onOpenProject, onStateChange]);

  return <canvas ref={canvasRef} id="c" aria-label="Anil Sahu Cosmos Canvas" />;
}
