// src/screens/ExperienceLevelScreen.tsx

import { BRAND } from "../styles/brand";
import type { ExperienceLevel } from "../app/state/session";

type Props = {
  onChoose: (level: ExperienceLevel) => void;
  onBack: () => void;
};

export function ExperienceLevelScreen({ onChoose, onBack }: Props) {
  const options: Array<{
    id: ExperienceLevel;
    title: string;
    desc: string;
    badge: string;
  }> = [
      { id: "NEW", title: "I’m new", desc: "Keep it simple and friendly.", badge: "beginner" },
      { id: "SOME", title: "I’ve done a few", desc: "A little guidance, no lectures.", badge: "casual" },
      { id: "PRO", title: "I know my wine", desc: "Skip the basics.", badge: "confident" },
    ];

  return (
    <div
      style={{
        padding: 32,
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <button
          onClick={onBack}
          style={{
            appearance: "none",
            border: `1px solid ${BRAND.colors.borderSoft}`,
            background: BRAND.colors.surfaceSoft,
            color: BRAND.colors.textPrimary,
            borderRadius: BRAND.radii.pill,
            padding: "10px 14px",
            fontSize: 13,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Step label */}
      <div
        style={{
          textAlign: "center",
          letterSpacing: "0.22em",
          fontSize: 12,
          textTransform: "uppercase",
          color: BRAND.colors.textSecondary,
          marginBottom: 10,
        }}
      >
        STEP 2 OF 4
      </div>

      {/* Title */}
      <h1
        style={{
          margin: 0,
          textAlign: "center",
          fontFamily: BRAND.typography.displayFamily,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.05,
          color: BRAND.colors.textPrimary,
        }}
      >
        Experience Level
      </h1>

      <p
        style={{
          margin: "12px auto 0",
          maxWidth: 520,
          textAlign: "center",
          color: BRAND.colors.textSecondary,
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        Pick the vibe you want. This only changes how much guidance you’ll see while rating.
      </p>

      {/* Options */}
      <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChoose(o.id)}
            style={{
              textAlign: "left",
              padding: 18,
              borderRadius: 18,
              border: `1px solid ${BRAND.colors.borderSoft}`,
              background: BRAND.colors.surface,
              boxShadow: BRAND.shadow.soft,
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: BRAND.colors.textPrimary }}>
                  {o.title}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    padding: "6px 10px",
                    borderRadius: BRAND.radii.pill,
                    background: BRAND.colors.accentSoft,
                    color: BRAND.colors.textPrimary,
                    border: `1px solid ${BRAND.colors.borderSoft}`,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {o.badge}
                </span>
              </div>

              <div style={{ marginTop: 8, color: BRAND.colors.textSecondary, fontSize: 14 }}>
                {o.desc}
              </div>

              <div style={{ marginTop: 10, color: BRAND.colors.textSecondary, fontSize: 12 }}>
                Tap to continue
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ color: BRAND.colors.accent, fontWeight: 800, fontSize: 13 }}>
                Choose →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExperienceLevelScreen;