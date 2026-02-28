// src/utils/profileCard.ts

import type { TagId } from "../app/state/session";

type WineSummary = {
  name: string;
  varietal: string;
  rating: number | null;
  tags: TagId[];
};

const TAG_LABELS: Record<TagId, string> = {
  FRUITY: "Fruity",
  FLORAL: "Floral",
  EARTHY: "Earthy",
  SPICY: "Spicy",
  SWEET: "Sweet",
  CRISP: "Crisp",
  SMOOTH: "Smooth",
  BOLD: "Bold",
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currY);
      line = words[i] + " ";
      currY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim().length > 0) ctx.fillText(line.trim(), x, currY);
  return currY;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function safeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function tagToSuggestion(tag: TagId): string {
  switch (tag) {
    case "CRISP":
      return "Try a bright white or sparkling option, something clean and refreshing.";
    case "FRUITY":
      return "Look for fruit-forward pours and lighter-bodied reds or rosés.";
    case "BOLD":
      return "Ask for fuller-bodied reds with more structure and depth.";
    case "SMOOTH":
      return "Try mellow reds or blends with a softer finish.";
    case "SWEET":
      return "Explore off-dry or sweet options (and don’t let anyone shame you).";
    case "EARTHY":
      return "Ask for more savory styles, Pinot Noir can be a good lane.";
    case "SPICY":
      return "Try reds that lean warm and spicy, like Zin-style profiles.";
    case "FLORAL":
      return "Try aromatic whites or rosés with more lift on the nose.";
    default:
      return "Ask your steward for a recommendation based on what you liked today.";
  }
}

function drawShadowCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  shadow: { color: string; blur: number; y: number }
) {
  ctx.save();
  ctx.shadowColor = shadow.color;
  ctx.shadowBlur = shadow.blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = shadow.y;
  ctx.fillStyle = fill;
  roundedRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

function drawChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: {
    padX: number;
    padY: number;
    r: number;
    bg: string;
    border: string;
    color: string;
    font: string;
  }
) {
  ctx.save();
  ctx.font = opts.font;
  const textW = ctx.measureText(text).width;
  const w = Math.ceil(textW + opts.padX * 2);
  const h = Math.ceil(34 + opts.padY * 2);

  ctx.fillStyle = opts.bg;
  ctx.strokeStyle = opts.border;
  ctx.lineWidth = 2;

  roundedRect(ctx, x, y, w, h, opts.r);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = opts.color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + opts.padX, y + h / 2 + 1);

  ctx.restore();
  return { w, h };
}

function drawRatingDots(
  ctx: CanvasRenderingContext2D,
  rating: number | null,
  x: number,
  y: number,
  opts: { dot: number; gap: number; stroke: string; fill: string; empty: string }
) {
  ctx.save();
  for (let i = 1; i <= 5; i++) {
    const cx = x + (i - 1) * (opts.dot * 2 + opts.gap) + opts.dot;
    const cy = y + opts.dot;

    ctx.beginPath();
    ctx.arc(cx, cy, opts.dot, 0, Math.PI * 2);
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = opts.stroke;
    ctx.stroke();

    ctx.fillStyle = rating !== null && i <= rating ? opts.fill : opts.empty;
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Safer style applier than casting object literals to CSSStyleDeclaration.
 * Works with TS + allows us to set CSS vars / vendor props via setProperty when needed.
 */
function applyStyles(el: HTMLElement, styles: Record<string, string>) {
  for (const [k, v] of Object.entries(styles)) {
    if (k.startsWith("--") || k.includes("-")) {
      el.style.setProperty(k, v);
      continue;
    }
    (el.style as unknown as Record<string, string>)[k] = v;
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] ?? "image/png";

  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

  return new Blob([bytes], { type: mime });
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 250);
}

type ShareCapableNavigator = Navigator & {
  canShare?: (data: { files: File[] }) => boolean;
  share?: (data: { files: File[]; title?: string; text?: string }) => Promise<void>;
};

type ShareAttempt = "shared" | "cancelled" | "unsupported" | "failed";

function canNativeShareFiles(file: File): boolean {
  const nav = navigator as ShareCapableNavigator;

  // Web Share requires secure context in practice.
  if (!globalThis.isSecureContext) return false;
  if (typeof nav.share !== "function") return false;
  if (typeof File === "undefined") return false;

  if (typeof nav.canShare === "function") {
    try {
      return nav.canShare({ files: [file] });
    } catch {
      return false;
    }
  }

  // If canShare isn't available, we *might* still be able to share.
  return true;
}

async function tryNativeShareFile(args: {
  file: File;
  title?: string;
  text?: string;
}): Promise<ShareAttempt> {
  const nav = navigator as ShareCapableNavigator;

  if (typeof nav.share !== "function") return "unsupported";

  try {
    await nav.share({
      files: [args.file],
      title: args.title,
      text: args.text,
    });
    return "shared";
  } catch (e: unknown) {
    const err = e as { name?: string; message?: string };

    // User hit "cancel" / dismissed share sheet.
    if (err?.name === "AbortError") return "cancelled";

    // Some browsers throw TypeError for unsupported share payloads.
    if (err?.name === "TypeError") return "unsupported";

    return "failed";
  }
}

function openPreviewModal(opts: { dataUrl: string; filename: string }) {
  const existing = document.getElementById("profile-card-preview-overlay");
  if (existing) existing.remove();

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.id = "profile-card-preview-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  applyStyles(overlay, {
    position: "fixed",
    inset: "0",
    zIndex: "9999",
    background: "rgba(0,0,0,0.78)",
    display: "grid",
    placeItems: "center",
    padding: "18px",
    boxSizing: "border-box",
  });

  const panel = document.createElement("div");
  applyStyles(panel, {
    width: "min(520px, 100%)",
    maxHeight: "90vh",
    borderRadius: "18px",
    background: "#0b0b0c",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
    overflow: "hidden",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
  });

  const header = document.createElement("div");
  applyStyles(header, {
    padding: "14px 14px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    color: "rgba(255,255,255,0.92)",
    fontFamily:
      'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial',
  });

  const leftHeader = document.createElement("div");
  applyStyles(leftHeader, { display: "grid", gap: "4px" });

  const title = document.createElement("div");
  title.textContent = "Preview";
  applyStyles(title, {
    fontWeight: "800",
    letterSpacing: "0.02em",
    fontSize: "14px",
  });

  const hint = document.createElement("div");
  hint.textContent = "Share or download your card.";
  applyStyles(hint, {
    fontSize: "12px",
    color: "rgba(255,255,255,0.65)",
  });

  leftHeader.appendChild(title);
  leftHeader.appendChild(hint);

  const headerActions = document.createElement("div");
  applyStyles(headerActions, {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  });

  const closeIconBtn = document.createElement("button");
  closeIconBtn.type = "button";
  closeIconBtn.setAttribute("aria-label", "Close");
  closeIconBtn.textContent = "✕";
  applyStyles(closeIconBtn, {
    appearance: "none",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "transparent",
    color: "rgba(255,255,255,0.85)",
    borderRadius: "999px",
    width: "34px",
    height: "34px",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    fontWeight: "800",
    lineHeight: "1",
  });

  headerActions.appendChild(closeIconBtn);

  header.appendChild(leftHeader);
  header.appendChild(headerActions);

  const imgWrap = document.createElement("div");
  applyStyles(imgWrap, {
    padding: "12px 14px",
    overflow: "auto",
    background:
      "radial-gradient(900px 500px at 50% 10%, rgba(255,255,255,0.06), transparent 60%)",
  });
  imgWrap.style.setProperty("-webkit-overflow-scrolling", "touch");

  const img = document.createElement("img");
  img.src = opts.dataUrl;
  img.alt = "Tasting profile card preview";
  applyStyles(img, {
    width: "100%",
    height: "auto",
    borderRadius: "14px",
    display: "block",
    boxShadow: "0 16px 50px rgba(0,0,0,0.45)",
  });
  imgWrap.appendChild(img);

  const footer = document.createElement("div");
  applyStyles(footer, {
    padding: "12px 14px 14px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    background: "rgba(255,255,255,0.04)",
    borderTop: "1px solid rgba(255,255,255,0.10)",
  });

  // Build the blob + file once so share/download use the same payload.
  const blob = dataUrlToBlob(opts.dataUrl);
  const file = new File([blob], opts.filename, { type: blob.type || "image/png" });

  const shareIsAvailable = canNativeShareFiles(file);

  const shareBtn = document.createElement("button");
  shareBtn.type = "button";
  shareBtn.textContent = "Share";
  applyStyles(shareBtn, {
    appearance: "none",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.16)",
    color: "rgba(255,255,255,0.95)",
    borderRadius: "999px",
    padding: "12px 14px",
    fontWeight: "900",
    cursor: "pointer",
    fontFamily:
      'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial',
  });

  const downloadBtn = document.createElement("button");
  downloadBtn.type = "button";
  downloadBtn.textContent = "Download PNG";
  applyStyles(downloadBtn, {
    appearance: "none",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.95)",
    borderRadius: "999px",
    padding: "12px 14px",
    fontWeight: "800",
    cursor: "pointer",
    fontFamily:
      'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial',
  });

  const cleanup = () => {
    overlay.remove();
    document.body.style.overflow = previousOverflow;
    window.removeEventListener("keydown", onKeyDown);
  };

  const triggerDownload = () => {
    triggerBlobDownload(blob, opts.filename);
  };

  const triggerShare = async () => {
    // If it isn't truly available, don't pretend. Just download.
    if (!shareIsAvailable) {
      triggerDownload();
      return;
    }

    const result = await tryNativeShareFile({
      file,
      title: "Tasting profile",
      text: "Here’s my tasting profile card.",
    });

    if (result === "shared") {
      cleanup();
      return;
    }

    // If the user cancelled, do nothing (NO surprise download).
    if (result === "cancelled") return;

    // Unsupported/failed: fall back to download.
    triggerDownload();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") cleanup();
  };

  downloadBtn.addEventListener("click", () => triggerDownload());
  closeIconBtn.addEventListener("click", () => cleanup());
  shareBtn.addEventListener("click", () => void triggerShare());

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cleanup();
  });
  window.addEventListener("keydown", onKeyDown);

  // If Share isn't real on this browser/context, hide it and make Download full width.
  if (!shareIsAvailable) {
    applyStyles(footer, { gridTemplateColumns: "1fr" });
    footer.appendChild(downloadBtn);
  } else {
    footer.appendChild(shareBtn);
    footer.appendChild(downloadBtn);
  }

  panel.appendChild(header);
  panel.appendChild(imgWrap);
  panel.appendChild(footer);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

export function downloadProfileCardPng(args: {
  wineryName?: string;
  title?: string;
  personality: string;
  topTags: string[];
  wines: WineSummary[];
}) {
  const {
    wineryName = "Wine Tasting",
    title = "Your Tasting Profile",
    personality,
    topTags,
    wines,
  } = args;

  const W = 1080;
  const H = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const PLUM_1 = "#2A0F1D";
  const PLUM_2 = "#150813";
  const CREAM = "#F5F2EC";
  const INK = "#141820";
  const MUTED = "rgba(20,24,32,0.70)";
  const ACCENT = "#7B1E3A";
  const ACCENT_SOFT = "rgba(123,30,58,0.12)";

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, PLUM_1);
  bg.addColorStop(1, PLUM_2);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  const vignette = ctx.createRadialGradient(
    W * 0.5,
    H * 0.35,
    80,
    W * 0.5,
    H * 0.5,
    H * 0.9
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  const outerPad = 64;
  const cardX = outerPad;
  const cardY = 84;
  const cardW = W - outerPad * 2;
  const cardH = H - cardY - 120;

  drawShadowCard(ctx, cardX, cardY, cardW, cardH, 64, CREAM, {
    color: "rgba(0,0,0,0.35)",
    blur: 60,
    y: 22,
  });

  const pad = 72;
  const x0 = cardX + pad;
  let y = cardY + 76;
  const maxW = cardW - pad * 2;

  ctx.fillStyle = ACCENT;
  roundedRect(ctx, x0, y - 28, maxW, 10, 999);
  ctx.fill();

  const serifStack =
    '"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif';
  const sansStack =
    'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial';

  ctx.fillStyle = INK;
  ctx.font = `700 36px ${sansStack}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(wineryName, x0, y + 26);

  y += 92;
  ctx.fillStyle = INK;
  ctx.font = `700 72px ${serifStack}`;
  y = wrapText(ctx, title, x0, y, maxW, 78) + 22;

  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(x0, y, maxW, 2);
  y += 26;

  ctx.fillStyle = MUTED;
  ctx.font = `500 30px ${sansStack}`;
  y =
    wrapText(
      ctx,
      "A quick snapshot of what you enjoyed today, plus a direction for next time.",
      x0,
      y + 8,
      maxW,
      40
    ) + 40;

  const pH = 190;
  drawShadowCard(ctx, x0, y, maxW, pH, 36, "rgba(255,255,255,0.72)", {
    color: "rgba(0,0,0,0.14)",
    blur: 28,
    y: 10,
  });

  ctx.fillStyle = INK;
  ctx.font = `800 26px ${sansStack}`;
  ctx.fillText("You gravitate toward", x0 + 32, y + 56);

  ctx.fillStyle = INK;
  ctx.font = `900 46px ${sansStack}`;
  wrapText(ctx, personality, x0 + 32, y + 112, maxW - 64, 54);

  const chipsY = y + 132;
  let cx = x0 + 32;
  const chipFont = `800 26px ${sansStack}`;
  const chipMaxW = x0 + maxW - 32;

  const chipLabels = topTags.slice(0, 3).filter(Boolean);
  for (const label of chipLabels) {
    const chip = drawChip(ctx, label, cx, chipsY, {
      padX: 16,
      padY: 3,
      r: 999,
      bg: ACCENT_SOFT,
      border: "rgba(123,30,58,0.25)",
      color: ACCENT,
      font: chipFont,
    });
    cx += chip.w + 12;
    if (cx > chipMaxW) break;
  }

  y += pH + 28;

  ctx.fillStyle = INK;
  ctx.font = `900 30px ${sansStack}`;
  ctx.fillText("Your Ratings & Impressions", x0, y + 34);
  y += 58;

  const colGap = 18;
  const colW = Math.floor((maxW - colGap) / 2);
  const rowH = 206;

  const maxCards = 6;
  const list = wines.slice(0, maxCards);

  for (let i = 0; i < list.length; i++) {
    const w = list[i];
    const col = i % 2;
    const row = Math.floor(i / 2);

    const wx = x0 + col * (colW + colGap);
    const wy = y + row * (rowH + 16);

    drawShadowCard(ctx, wx, wy, colW, rowH, 32, "#FFFFFF", {
      color: "rgba(0,0,0,0.14)",
      blur: 24,
      y: 10,
    });

    ctx.fillStyle = INK;
    ctx.font = `900 30px ${sansStack}`;
    wrapText(ctx, w.name, wx + 24, wy + 52, colW - 48, 36);

    ctx.fillStyle = MUTED;
    ctx.font = `600 24px ${sansStack}`;
    ctx.fillText(w.varietal || "Varietal", wx + 24, wy + 86);

    drawRatingDots(ctx, w.rating, wx + 24, wy + 104, {
      dot: 9,
      gap: 14,
      stroke: "rgba(0,0,0,0.22)",
      fill: ACCENT,
      empty: "rgba(0,0,0,0.10)",
    });

    const tags = (w.tags ?? []).slice(0, 3);
    let tx = wx + 24;
    const ty = wy + 142;
    for (const t of tags) {
      const label = TAG_LABELS[t];
      const chip = drawChip(ctx, label, tx, ty, {
        padX: 14,
        padY: 2,
        r: 999,
        bg: "#FAFAF9",
        border: "rgba(0,0,0,0.10)",
        color: INK,
        font: `800 22px ${sansStack}`,
      });
      tx += chip.w + 10;
      if (tx > wx + colW - 24) break;
    }

    if (tags.length === 0) {
      ctx.fillStyle = MUTED;
      ctx.font = `600 22px ${sansStack}`;
      ctx.fillText("No tags selected", wx + 24, wy + 168);
    }
  }

  const rows = Math.ceil(list.length / 2);
  y += rows * (rowH + 16) + 18;

  const labelToTag: Record<string, TagId> = {
    Fruity: "FRUITY",
    Floral: "FLORAL",
    Earthy: "EARTHY",
    Spicy: "SPICY",
    Sweet: "SWEET",
    Crisp: "CRISP",
    Smooth: "SMOOTH",
    Bold: "BOLD",
  };

  const inferredTags = topTags
    .map((t) => labelToTag[t])
    .filter(Boolean)
    .slice(0, 2);

  const sH = 320;
  drawShadowCard(ctx, x0, y, maxW, sH, 36, "#FFFFFF", {
    color: "rgba(0,0,0,0.14)",
    blur: 26,
    y: 10,
  });

  ctx.fillStyle = INK;
  ctx.font = `950 30px ${sansStack}`;
  ctx.fillText("Next time you might enjoy", x0 + 28, y + 58);

  let sy = y + 94;

  if (inferredTags.length === 0) {
    ctx.fillStyle = MUTED;
    ctx.font = `600 28px ${sansStack}`;
    wrapText(
      ctx,
      "Rate wines and pick tags to unlock a better recommendation.",
      x0 + 28,
      sy + 10,
      maxW - 56,
      38
    );
  } else {
    for (const t of inferredTags) {
      ctx.fillStyle = ACCENT;
      ctx.font = `950 28px ${sansStack}`;
      ctx.fillText(TAG_LABELS[t], x0 + 28, sy + 30);

      ctx.fillStyle = MUTED;
      ctx.font = `600 28px ${sansStack}`;
      sy =
        wrapText(ctx, tagToSuggestion(t), x0 + 28, sy + 66, maxW - 56, 38) + 24;

      if (sy > y + sH - 44) break;

      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(x0 + 28, sy + 6, maxW - 56, 2);
      sy += 18;
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = `600 26px ${sansStack}`;
  ctx.fillText(
    "Saved from your tasting session",
    cardX + 70,
    cardY + cardH + 70
  );

  const dataUrl = canvas.toDataURL("image/png");
  const filename =
    (safeFilename(`${wineryName}-${personality}`) || "tasting-profile") + ".png";

  openPreviewModal({ dataUrl, filename });
}