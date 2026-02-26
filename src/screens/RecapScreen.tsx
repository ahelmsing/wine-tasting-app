// src/screens/RecapScreen.tsx

import type { TagId, WineResponse } from "../app/state/session";
import { downloadProfileCardPng } from "../utils/profileCard";
import { BRAND } from "../styles/brand";

type Wine = {
  id: string;
  name: string;
  varietal: string;
};

type Props = {
  wines: Wine[];
  responsesByWineId: Record<string, WineResponse>;
  onRestart: () => void;
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

function calculateTagCounts(responses: Record<string, WineResponse>) {
  const counts: Record<TagId, number> = {
    FRUITY: 0,
    FLORAL: 0,
    EARTHY: 0,
    SPICY: 0,
    SWEET: 0,
    CRISP: 0,
    SMOOTH: 0,
    BOLD: 0,
  };

  Object.values(responses).forEach((r) => {
    r.tags.forEach((t) => {
      counts[t] += 1;
    });
  });

  return counts;
}

function topTagsFromCounts(counts: Record<TagId, number>, take: number): TagId[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, take)
    .map(([tag]) => tag as TagId)
    .filter((t) => counts[t] > 0);
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

export function RecapScreen({ wines, responsesByWineId, onRestart }: Props) {
  const counts = calculateTagCounts(responsesByWineId);
  const top2 = topTagsFromCounts(counts, 2);

  const personality =
    top2.length > 0 ? top2.map((t) => TAG_LABELS[t]).join(" & ") : "Still exploring";

  const onSaveCard = () => {
    const wineSummaries = wines.map((w) => {
      const resp = responsesByWineId[w.id] ?? { rating: null, tags: [] };
      return {
        name: w.name,
        varietal: w.varietal,
        rating: resp.rating,
        tags: resp.tags,
      };
    });

    downloadProfileCardPng({
      wineryName: "Wine Tasting",
      title: "Your Tasting Profile",
      personality,
      topTags: top2.map((t) => TAG_LABELS[t]),
      wines: wineSummaries,
    });
  };

  const cardStyle: React.CSSProperties = {
    border: `1px solid ${BRAND.colors.border}`,
    borderRadius: BRAND.radius.large,
    background: BRAND.colors.surface,
    boxShadow: BRAND.shadow.card,
  };

  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #D6D3D1",
    background: "#FAFAF9",
    fontSize: 12,
    fontWeight: 800,
    color: BRAND.colors.textPrimary,
  };

  return (
    <div style={{ color: BRAND.colors.textPrimary }}>
      {/* Accent Bar */}
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: BRAND.colors.accent,
          marginBottom: 18,
        }}
      />

      {/* “Signature” Header */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: BRAND.typography.serif,
            fontWeight: 700,
            letterSpacing: 0.25,
            fontSize: 42,
            lineHeight: 1.08,
            marginTop: 0,
          }}
        >
          Your Tasting Profile
        </div>

        <div
          style={{
            marginTop: 10,
            height: 1,
            background: BRAND.colors.border,
          }}
        />

        <div
          style={{
            marginTop: 10,
            color: BRAND.colors.textSecondary,
            fontSize: 14,
          }}
        >
          A quick snapshot of what you enjoyed today, plus a direction for next time.
        </div>
      </div>

      {/* Personality Summary */}
      <div
        style={{
          ...cardStyle,
          background: BRAND.colors.surfaceSoft,
          padding: 16,
          marginBottom: 14,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 13, letterSpacing: 0.2 }}>
          You gravitate toward
        </div>

        <div style={{ fontSize: 18, fontWeight: 900 }}>{personality}</div>

        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {top2.length === 0 ? (
            <span style={{ color: BRAND.colors.textSecondary, fontSize: 13 }}>
              Pick tags during the tasting to personalize this.
            </span>
          ) : (
            top2.map((t) => (
              <span key={t} style={chipStyle}>
                {TAG_LABELS[t]}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Primary action */}
      <button
        onClick={onSaveCard}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 999,
          border: `1px solid ${BRAND.colors.accent}`,
          background: BRAND.colors.accent,
          color: "#FFFFFF",
          fontWeight: 900,
          letterSpacing: 0.2,
          cursor: "pointer",
          boxShadow: "0 10px 26px rgba(0,0,0,0.10)",
          marginBottom: 22,
        }}
      >
        Save profile card
      </button>

      {/* Wine Grid */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 900, marginBottom: 10, fontSize: 14 }}>
          Your Ratings & Impressions
        </div>

        <div
          className="recap-grid"
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "1fr",
          }}
        >
          {wines.map((wine) => {
            const response = responsesByWineId[wine.id];
            if (!response) return null;

            return (
              <div
                key={wine.id}
                style={{
                  ...cardStyle,
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 950, fontSize: 15 }}>{wine.name}</div>
                <div style={{ fontSize: 13, color: BRAND.colors.textSecondary, marginTop: 2 }}>
                  {wine.varietal}
                </div>

                <div style={{ marginTop: 10, fontSize: 13 }}>
                  <span style={{ color: BRAND.colors.textSecondary }}>Rating:</span>{" "}
                  <span style={{ fontWeight: 900 }}>{response.rating ?? "-"}</span> / 5
                </div>

                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {response.tags.length > 0 ? (
                    response.tags.map((t) => (
                      <span key={t} style={chipStyle}>
                        {TAG_LABELS[t]}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: BRAND.colors.textSecondary, fontSize: 13 }}>
                      No tags selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <style>
          {`
            @media (min-width: 700px) {
              .recap-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }
          `}
        </style>
      </div>

      {/* Suggestions */}
      <div style={{ ...cardStyle, padding: 16, marginBottom: 18 }}>
        <div style={{ fontWeight: 950, marginBottom: 10, fontSize: 14 }}>
          Next time you might enjoy
        </div>

        {top2.length === 0 ? (
          <div style={{ color: BRAND.colors.textSecondary, fontSize: 14 }}>
            Rate wines and pick tags to unlock a better recommendation.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {top2.map((t) => (
              <div key={t} style={{ fontSize: 14 }}>
                <div style={{ fontWeight: 950 }}>{TAG_LABELS[t]}</div>
                <div style={{ color: BRAND.colors.textSecondary, marginTop: 2 }}>
                  {tagToSuggestion(t)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Secondary action */}
      <button
        onClick={onRestart}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 999,
          border: "1px solid #D6D3D1",
          background: "#FFFFFF",
          color: BRAND.colors.textPrimary,
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        Start Over
      </button>
    </div>
  );
}