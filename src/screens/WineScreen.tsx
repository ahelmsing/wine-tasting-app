// src/screens/WineScreen.tsx

import type { TagId, WineResponse } from "../app/state/session";
import { BRAND } from "../styles/brand";

type Wine = {
  id: string;
  name: string;
  varietal: string;
  microStory: string;
};

type Props = {
  wine: Wine;
  progressLabel: string;
  response: WineResponse;

  onBack: () => void;
  onToggleTag: (tag: TagId) => void;
  onSetRating: (rating: 1 | 2 | 3 | 4 | 5) => void;
  onNext: () => void;
};

const TAGS: Array<{ id: TagId; label: string }> = [
  { id: "FRUITY", label: "Fruity" },
  { id: "FLORAL", label: "Floral" },
  { id: "EARTHY", label: "Earthy" },
  { id: "SPICY", label: "Spicy" },
  { id: "SWEET", label: "Sweet" },
  { id: "CRISP", label: "Crisp" },
  { id: "SMOOTH", label: "Smooth" },
  { id: "BOLD", label: "Bold" },
];

export default function WineScreen({
  wine,
  progressLabel,
  response,
  onBack,
  onToggleTag,
  onSetRating,
  onNext,
}: Props) {
  const selectedTags = response.tags ?? [];
  const rating = response.rating;

  const hasRating = rating !== null;
  const tagLimitReached = selectedTags.length >= 3;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",
        padding: "clamp(18px, 3.2vw, 32px)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: `1px solid ${BRAND.colors.borderSoft}`,
            background: BRAND.colors.surface,
            borderRadius: BRAND.radii.pill,
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ← Back
        </button>

        <div
          style={{
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontSize: 12,
            color: BRAND.colors.textSecondary,
          }}
        >
          {progressLabel}
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: BRAND.typography.displayFamily,
            fontSize: "clamp(34px, 4.8vw, 56px)",
            lineHeight: 1.05,
            margin: 0,
            color: BRAND.colors.textPrimary,
            fontWeight: 700,
          }}
        >
          {wine.name}
        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            color: BRAND.colors.textSecondary,
            fontSize: 14,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: BRAND.radii.pill,
              border: `1px solid ${BRAND.colors.borderSoft}`,
              background: "rgba(255,255,255,0.65)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: 11,
              color: BRAND.colors.textPrimary,
            }}
          >
            {wine.varietal}
          </span>
          <span style={{ fontSize: 13 }}>
            Quick impression first, details later.
          </span>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 15,
            lineHeight: 1.6,
            color: BRAND.colors.textPrimary,
            maxWidth: 62 * 12, // readable line length-ish
          }}
        >
          {wine.microStory}
        </div>
      </div>

      {/* Tags Card */}
      <div
        style={{
          background: BRAND.colors.surface,
          borderRadius: BRAND.radii.card,
          border: `1px solid ${BRAND.colors.borderSoft}`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
          padding: 18,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: BRAND.colors.textPrimary }}>
            What stands out?
          </div>

          <div
            style={{
              fontSize: 12,
              color: BRAND.colors.textSecondary,
            }}
          >
            Pick up to <b>3</b>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))",
            gap: 10,
          }}
        >
          {TAGS.map((t) => {
            const isSelected = selectedTags.includes(t.id);
            const isDisabled = !isSelected && tagLimitReached;

            return (
              <button
                key={t.id}
                onClick={() => onToggleTag(t.id)}
                disabled={isDisabled}
                style={{
                  padding: "10px 12px",
                  borderRadius: BRAND.radii.pill,
                  border: isSelected
                    ? `1px solid ${BRAND.colors.accent}`
                    : `1px solid ${BRAND.colors.borderSoft}`,
                  background: isSelected ? BRAND.colors.accentSoft : "rgba(0,0,0,0.02)",
                  color: BRAND.colors.textPrimary,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.45 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span>{t.label}</span>
                <span
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    border: isSelected
                      ? `2px solid ${BRAND.colors.accent}`
                      : `2px solid rgba(0,0,0,0.22)`,
                    background: isSelected ? BRAND.colors.accent : "transparent",
                    flex: "0 0 auto",
                  }}
                />
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: BRAND.colors.textSecondary,
          }}
        >
          Tip: go with your gut. “Fruity + Crisp + Smooth” is totally valid.
        </div>
      </div>

      {/* Rating Card */}
      <div
        style={{
          background: BRAND.colors.surface,
          borderRadius: BRAND.radii.card,
          border: `1px solid ${BRAND.colors.borderSoft}`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
          padding: 18,
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: BRAND.colors.textPrimary }}>
          How much are you enjoying it?
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: BRAND.colors.textSecondary,
            fontSize: 12,
            marginTop: 10,
            marginBottom: 12,
          }}
        >
          <span>Not enjoying</span>
          <span>Loving it</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            alignItems: "center",
            width: "100%",
            justifyItems: "center",
          }}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = rating === n;

            return (
              <button
                key={n}
                onClick={() => onSetRating(n as 1 | 2 | 3 | 4 | 5)}
                aria-label={`Rate ${n} out of 5`}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  border: selected
                    ? `2px solid ${BRAND.colors.accent}`
                    : `2px solid rgba(0,0,0,0.20)`,
                  background: selected ? BRAND.colors.accentSoft : "transparent",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: selected ? BRAND.colors.accent : "rgba(0,0,0,0.25)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {!hasRating && (
          <div style={{ color: BRAND.colors.textSecondary, fontSize: 12, marginTop: 12 }}>
            Choose a rating to continue.
          </div>
        )}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!hasRating}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: BRAND.radii.pill,
          border: "none",
          background: BRAND.colors.accent,
          color: "#FFFFFF",
          fontWeight: 800,
          cursor: hasRating ? "pointer" : "not-allowed",
          opacity: hasRating ? 1 : 0.45,
          boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
        }}
      >
        Next →
      </button>

      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: BRAND.colors.textSecondary,
          textAlign: "center",
        }}
      >
        You can always tweak tags later in the recap.
      </div>
    </div>
  );
}