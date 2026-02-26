// src/screens/WineScreen.tsx

import type { TagId, WineResponse } from "../app/state/session";

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

export function WineScreen({
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
    <div>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <button onClick={onBack}>← Back</button>
        <div style={{ color: "#6B7280", fontSize: 14 }}>{progressLabel}</div>
      </div>

      {/* Wine Info */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 6px 0" }}>{wine.name}</h1>

        <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 10 }}>
          {wine.varietal}
        </div>

        <div style={{ fontSize: 16, lineHeight: 1.5 }}>{wine.microStory}</div>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          What stands out most?
        </div>

        <div style={{ color: "#6B7280", fontSize: 12, marginBottom: 12 }}>
          Select up to 3.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
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
                  borderRadius: 999,

                  // Stronger "pill" presence when unselected
                  border: isSelected ? "1px solid #1C1C1E" : "1px solid #D1D5DB",
                  background: isSelected ? "#1C1C1E" : "#F9FAFB",
                  color: isSelected ? "#FFFFFF" : "#1C1C1E",

                  opacity: isDisabled ? 0.45 : 1,
                  fontSize: 14,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
          How much are you enjoying this?
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#6B7280",
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          <span>Not enjoying</span>
          <span>Loving it</span>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = rating === n;
            return (
              <button
                key={n}
                onClick={() => onSetRating(n as 1 | 2 | 3 | 4 | 5)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  border: "2px solid #1C1C1E",
                  background: selected ? "#1C1C1E" : "transparent",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!hasRating}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 16,
          background: "#1C1C1E",
          color: "#FFFFFF",
          opacity: hasRating ? 1 : 0.45,
        }}
      >
        Next
      </button>

      {!hasRating && (
        <div style={{ color: "#6B7280", fontSize: 12, marginTop: 10 }}>
          Choose a rating to continue.
        </div>
      )}
    </div>
  );
}