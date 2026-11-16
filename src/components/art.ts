/**
 * Project Screenshot Atlas & Mockup Management for Anil Sahu's Portfolio.
 * Uses real screenshots of live production websites:
 * - https://karotkingdom.com/
 * - https://shriradhecollection.com/
 * - https://pedneuro.in/
 * - https://www.kiddyscornerpublicschool.com/
 */

export const PROJECT_SCREENSHOTS = [
  "/screenshots/karotkingdom.png",
  "/screenshots/shriradhe.png",
  "/screenshots/pedneuro.png",
  "/screenshots/kiddyscorner.png",
];

export function workImage(index: number): string {
  const i = Math.abs(index) % PROJECT_SCREENSHOTS.length;
  return PROJECT_SCREENSHOTS[i];
}

// 16 distinct project screenshot views across Anil's 4 core production projects
export const PROJECT_VIEWS = [
  // Karot Kingdom (0 - 3)
  {
    title: "Karot Kingdom",
    subtitle: "Bespoke Lab-Grown Diamonds",
    url: "https://karotkingdom.com",
    bg: "#0c0e14",
    surface: "#151b29",
    accent: "#68b5ff",
    badge: "LAB LUXURY",
    headline: "Bespoke Solitaire Rings",
    tag: "3D Customizer · IGI Certified · Razorpay",
  },
  {
    title: "Karot Kingdom",
    subtitle: "Interactive 3D Solitaire Builder",
    url: "https://karotkingdom.com/builder",
    bg: "#0a0c12",
    surface: "#121724",
    accent: "#80d0ff",
    badge: "3D PRONG MATRIX",
    headline: "Live Carat & Cut Formula",
    tag: "React 3D View · VVS1 Clarity · Ideal Cut",
  },
  {
    title: "Karot Kingdom",
    subtitle: "Certified Diamond Catalog",
    url: "https://karotkingdom.com/catalog",
    bg: "#0e111a",
    surface: "#171e2e",
    accent: "#68b5ff",
    badge: "INVENTORY",
    headline: "Emerald, Oval & Round Cuts",
    tag: "Live SQL Stock · Dynamic Price Calculation",
  },
  {
    title: "Karot Kingdom",
    subtitle: "Luxury Checkout & Bag",
    url: "https://karotkingdom.com/checkout",
    bg: "#0b0d14",
    surface: "#141926",
    accent: "#99d5ff",
    badge: "SSL ENCRYPTED",
    headline: "Secured Global Insured Delivery",
    tag: "JWT Authentication · Razorpay Webhooks",
  },

  // Shri Radhe Collection (4 - 7)
  {
    title: "Shri Radhe Collection",
    subtitle: "Festive Bridal & Ethnic Couture",
    url: "https://shriradhecollection.com",
    bg: "#140f10",
    surface: "#201316",
    accent: "#ff7088",
    badge: "HANDLOOM",
    headline: "Banarasi Silk & Bridal Lehengas",
    tag: "Direct Weaver Hub · Express Shipping",
  },
  {
    title: "Shri Radhe Collection",
    subtitle: "Live Logistics Dashboard",
    url: "https://shriradhecollection.com/logistics",
    bg: "#160e10",
    surface: "#241519",
    accent: "#ff4d6a",
    badge: "NIMBUSPOST API",
    headline: "Automated Dispatch & Tracking",
    tag: "Bluedart & Delhivery Air · Real-time AWB",
  },
  {
    title: "Shri Radhe Collection",
    subtitle: "Bridal Ensemble Gallery",
    url: "https://shriradhecollection.com/bridal",
    bg: "#180f12",
    surface: "#28161b",
    accent: "#ff7088",
    badge: "COUTURE",
    headline: "Zardozi Handcrafted Silks",
    tag: "Multi-Variant Matrix · Size & Draping",
  },
  {
    title: "Shri Radhe Collection",
    subtitle: "Real-time Order Status",
    url: "https://shriradhecollection.com/track",
    bg: "#130d0f",
    surface: "#1f1215",
    accent: "#ff8fa3",
    badge: "LIVE TRACK",
    headline: "Instant SMS & WhatsApp Updates",
    tag: "Automated Webhooks · Return Reconciliation",
  },

  // PedNeuro (8 - 11)
  {
    title: "PedNeuro",
    subtitle: "Pediatric Neurology Portal",
    url: "https://pedneuro.in",
    bg: "#091316",
    surface: "#0f2227",
    accent: "#2dd4bf",
    badge: "CLINICAL PORTAL",
    headline: "Compassionate Epilepsy & Neuro Care",
    tag: "Next.js SSR · Fast Diagnostic Engine",
  },
  {
    title: "PedNeuro",
    subtitle: "Clinical EEG Telemetry Report",
    url: "https://pedneuro.in/telemetry",
    bg: "#071012",
    surface: "#0c1c20",
    accent: "#38bdf8",
    badge: "DIAGNOSTICS",
    headline: "Encrypted Patient Case Records",
    tag: "HIPAA Compliant · RBAC Security Architecture",
  },
  {
    title: "PedNeuro",
    subtitle: "Parent Guidance & Milestones",
    url: "https://pedneuro.in/milestones",
    bg: "#0a1518",
    surface: "#11262c",
    accent: "#2dd4bf",
    badge: "PARENT HUB",
    headline: "Neurodevelopmental Roadmap",
    tag: "Early Intervention Guides · Telehealth",
  },
  {
    title: "PedNeuro",
    subtitle: "Doctor Consultation Scheduler",
    url: "https://pedneuro.in/consult",
    bg: "#081215",
    surface: "#0e2025",
    accent: "#5eead4",
    badge: "APPOINTMENTS",
    headline: "Synchronized Clinical Calendar",
    tag: "Instant Slot Booking · SMS Notifications",
  },

  // Kiddy's Corner Public School (12 - 15)
  {
    title: "Kiddy's Corner",
    subtitle: "Academic Management Platform",
    url: "https://kiddyscornerpublicschool.com",
    bg: "#141108",
    surface: "#20180b",
    accent: "#f59e0b",
    badge: "EDUCATION",
    headline: "Excellence in Holistic Education",
    tag: "Full-Stack Portal · cPanel & SSL Deployed",
  },
  {
    title: "Kiddy's Corner",
    subtitle: "Student ERP & Gradebook",
    url: "https://kiddyscornerpublicschool.com/erp",
    bg: "#120f07",
    surface: "#1c1509",
    accent: "#fbbf24",
    badge: "STUDENT ERP",
    headline: "Automated Academic Report Cards",
    tag: "SQL Relational DB · Teacher & Admin Roles",
  },
  {
    title: "Kiddy's Corner",
    subtitle: "Online Fee Portal & Receipts",
    url: "https://kiddyscornerpublicschool.com/fees",
    bg: "#161209",
    surface: "#241b0d",
    accent: "#f59e0b",
    badge: "FEE LEDGER",
    headline: "Digital Fee Collections & Receipts",
    tag: "Automated Dues Tracking · SMS Alert Engine",
  },
  {
    title: "Kiddy's Corner",
    subtitle: "Dynamic Circulars & Notices",
    url: "https://kiddyscornerpublicschool.com/notices",
    bg: "#110e06",
    surface: "#1a1308",
    accent: "#fcd34d",
    badge: "NOTICE BOARD",
    headline: "Live Faculty Broadcast Dashboard",
    tag: "Fast CMS Engine · Event Calendar Tracker",
  },
];

// Create Texture Atlas with real live project screenshots
export function createProjectAtlasCanvas(
  loadedImages?: (HTMLImageElement | null)[]
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const size = 2048;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = "#0c0d10";
  ctx.fillRect(0, 0, size, size);

  const tileSize = size / 4; // 512x512 per tile (4x4 grid)

  for (let i = 0; i < 16; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const tx = col * tileSize;
    const ty = row * tileSize;
    const projectIndex = row; // row 0: Karot, row 1: Radhe, row 2: PedNeuro, row 3: Kiddy's
    const img = loadedImages && loadedImages[projectIndex];
    const p = PROJECT_VIEWS[i];

    // Solid dark base for every tile
    ctx.fillStyle = p.bg || "#101216";
    ctx.fillRect(tx, ty, tileSize, tileSize);

    if (img && img.complete && img.naturalWidth > 0) {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;

      let sx = 0;
      let sy = 0;
      let sw = nw;
      let sh = Math.min(nh, (nw * 9) / 16);

      if (col === 0) {
        // Top full hero view
        sx = 0;
        sy = 0;
        sw = nw;
        sh = Math.min(nh, (nw * 9) / 16);
      } else if (col === 1) {
        // Mid-page content / product showcase
        sx = 0;
        sy = Math.min(nh * 0.22, Math.max(0, nh - 350));
        sw = nw;
        sh = Math.min(nh - sy, (nw * 9) / 16);
      } else if (col === 2) {
        // Lower features / cards view
        sx = 0;
        sy = Math.min(nh * 0.44, Math.max(0, nh - 350));
        sw = nw;
        sh = Math.min(nh - sy, (nw * 9) / 16);
      } else {
        // Zoomed interactive detail
        sx = nw * 0.05;
        sy = nh * 0.08;
        sw = nw * 0.9;
        sh = Math.min(nh - sy, (sw * 9) / 16);
      }

      ctx.drawImage(img, sx, sy, sw, sh, tx, ty, tileSize, tileSize);

      // Subtle dark vignette on edges
      const grad = ctx.createLinearGradient(tx, ty, tx, ty + tileSize);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.2)");
      grad.addColorStop(0.15, "rgba(0, 0, 0, 0.0)");
      grad.addColorStop(0.85, "rgba(0, 0, 0, 0.0)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = grad;
      ctx.fillRect(tx, ty, tileSize, tileSize);

      // Subtle edge border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 2;
      ctx.strokeRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
    } else {
      // Fallback sleek UI card mockup while image loads
      ctx.fillStyle = p.surface;
      ctx.fillRect(tx, ty, tileSize, 44);

      // Window controls
      ctx.fillStyle = "#ff5f57";
      ctx.beginPath(); ctx.arc(tx + 22, ty + 22, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#febc2e";
      ctx.beginPath(); ctx.arc(tx + 38, ty + 22, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#28c840";
      ctx.beginPath(); ctx.arc(tx + 54, ty + 22, 5, 0, Math.PI * 2); ctx.fill();

      // Badge
      ctx.fillStyle = p.accent;
      ctx.font = "bold 13px 'Inter Tight', sans-serif";
      ctx.fillText(p.badge, tx + 28, ty + 90);

      // Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "italic 32px 'Instrument Serif', serif";
      ctx.fillText(p.title, tx + 28, ty + 140);

      // Headline
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "15px 'Inter Tight', sans-serif";
      ctx.fillText(p.headline, tx + 28, ty + 180);

      // Tags
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px 'Inter Tight', sans-serif";
      ctx.fillText(p.tag, tx + 28, ty + 220);

      // Decorative UI panel wireframe
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(tx + 28, ty + 260, tileSize - 56, 160);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(tx + 28, ty + 260, tileSize - 56, 160);
    }
  }

  return canvas;
}
