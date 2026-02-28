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
      {
        id: "NEW",
        title: "I’m new",
        desc: "Keep it simple and friendly.",
        badge: "beginner",
      },
      {
        id: "SOME",
        title: "I’ve done a few",
        desc: "A little guidance, no lectures.",
        badge: "casual",
      },
      {
        id: "PRO",
        title: "I know my wine",
        desc: "Skip the basics.",
        badge: "confident",
      },
    ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",

        // Match FlightSelect: small safety inset, avoid “double padding”
        paddingInline: "clamp(6px, 1.8vw, 12px)",
        paddingBlock: 0,

        boxSizing: "border-box",
        minWidth: 0,
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
            whiteSpace: "nowrap",
            boxShadow: BRAND.shadow.soft,
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
          fontSize: "clamp(34px, 4.6vw, 44px)",
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
              cursor: "pointer",
              padding: 18,
              borderRadius: BRAND.radii.card,
              border: `1px solid ${BRAND.colors.borderSoft}`,
              background: BRAND.colors.surface,
              boxShadow: BRAND.shadow.soft,
              transition: "transform 120ms ease, box-shadow 120ms ease",
              width: "100%",
              boxSizing: "border-box",
              minWidth: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = BRAND.shadow.card;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = BRAND.shadow.soft;
            }}
          >
            {/* Layout like FlightSelect: clear header row, full-width description, CTA bottom-right */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gridTemplateRows: "auto auto auto",
                columnGap: 12,
                rowGap: 10,
                alignItems: "start",
                minWidth: 0,
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: BRAND.colors.textPrimary,
                  minWidth: 0,
                }}
              >
                {o.title}
              </div>

              {/* Badge pill */}
              <div
                style={{
                  justifySelf: "end",
                  alignSelf: "start",
                  borderRadius: BRAND.radii.pill,
                  padding: "6px 10px",
                  border: `1px solid ${BRAND.colors.borderSoft}`,
                  background: BRAND.colors.accentSoft,
                  color: BRAND.colors.textPrimary,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {o.badge}
              </div>

              {/* Description spans full width */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  color: BRAND.colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.45,
                  minWidth: 0,
                }}
              >
                {o.desc}
              </div>

              {/* CTA bottom-right */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: 12,
                }}
              >
                <span style={{ color: BRAND.colors.accent, fontWeight: 800 }}>
                  Choose →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExperienceLevelScreen;