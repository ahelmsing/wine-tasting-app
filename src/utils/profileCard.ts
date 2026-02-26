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

export function downloadProfileCardPng(args: {
  wineryName?: string;
  title?: string;
  personality: string;
  topTags: string[]; // e.g. ["Fruity", "Crisp"]
  wines: WineSummary[];
}) {
  const {
    wineryName = "Wine Tasting",
    title = "Your Tasting Profile",
    personality,
    topTags,
    wines,
  } = args;

  // Card size (portrait, phone-friendly)
  const W = 1080;
  const H = 1920;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  const pad = 72;

  // Winery name
  ctx.fillStyle = "#111827";
  ctx.font = "700 64px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText(wineryName, pad, 140);

  // Title
  ctx.fillStyle = "#111827";
  ctx.font = "700 72px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  wrapText(ctx, title, pad, 240, W - pad * 2, 84);

  // Personality box
  const boxX = pad;
  const boxY = 360;
  const boxW = W - pad * 2;
  const boxH = 200;

  ctx.fillStyle = "#F3F4F6";
  roundedRect(ctx, boxX, boxY, boxW, boxH, 36);
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.font = "700 44px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText("You gravitate toward:", boxX + 40, boxY + 78);

  ctx.fillStyle = "#111827";
  ctx.font = "600 52px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText(personality, boxX + 40, boxY + 150);

  // Top tags line
  ctx.fillStyle = "#6B7280";
  ctx.font = "500 34px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText(`Top tags: ${topTags.join(", ")}`, pad, 620);

  // Wines header
  ctx.fillStyle = "#111827";
  ctx.font = "700 44px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText("Your Wines", pad, 700);

  // Wine list
  let y = 760;
  const rowGap = 18;

  for (const w of wines.slice(0, 8)) {
    const rowH = 150;

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 3;
    roundedRect(ctx, pad, y, W - pad * 2, rowH, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#111827";
    ctx.font = "700 40px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    wrapText(ctx, w.name, pad + 32, y + 54, W - pad * 2 - 64, 46);

    ctx.fillStyle = "#6B7280";
    ctx.font = "500 30px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    const ratingText = w.rating ? `${w.rating}/5` : "-/5";
    ctx.fillText(`${w.varietal} • Rating: ${ratingText}`, pad + 32, y + 98);

    const tagText = w.tags.length > 0 ? w.tags.map((t) => TAG_LABELS[t]).join(", ") : "none";
    ctx.fillText(`Tags: ${tagText}`, pad + 32, y + 132);

    y += rowH + rowGap;

    if (y > 1380) break;
  }

  // Next time section (based on topTags text -> best-effort mapping)
  // We don’t have TagId here for topTags, so we infer by label.
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

  // Section box
  const sY = Math.max(y + 20, 1420);
  const sH = 320;

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 3;
  roundedRect(ctx, pad, sY, W - pad * 2, sH, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111827";
  ctx.font = "700 44px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText("Next time you might enjoy", pad + 32, sY + 70);

  let syText = sY + 120;

  ctx.fillStyle = "#111827";
  ctx.font = "700 36px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";

  ctx.fillStyle = "#111827";
  ctx.font = "700 36px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillStyle = "#111827";

  for (const t of inferredTags) {
    const label = TAG_LABELS[t];
    ctx.fillStyle = "#111827";
    ctx.font = "700 36px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(label, pad + 32, syText);

    ctx.fillStyle = "#6B7280";
    ctx.font = "500 32px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    syText = wrapText(ctx, tagToSuggestion(t), pad + 32, syText + 44, W - pad * 2 - 64, 40) + 54;

    if (syText > sY + sH - 40) break;
  }

  // Footer
  ctx.fillStyle = "#9CA3AF";
  ctx.font = "500 28px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillText("Save this for your next visit.", pad, 1860);

  // Export
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;

  const filename = safeFilename(`${wineryName}-${personality}`) || "tasting-profile";
  link.download = `${filename}.png`;
  link.click();
}