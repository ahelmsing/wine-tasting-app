// src/screens/FlightSelectScreen.tsx
import { BRAND } from "../styles/brand";

type FlightOption = {
  id: string;
  name: string;
  description: string;
  wineCount: number;
};

type Props = {
  flights: FlightOption[];
  onSelectFlight: (flightId: string) => void;
  onBack: () => void;
};

export function FlightSelectScreen({ flights, onSelectFlight, onBack }: Props) {
  return (
    <div style={{ padding: "clamp(18px, 4vw, 40px)" }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{
            appearance: "none",
            border: `1px solid ${BRAND.colors.borderSoft}`,
            background: BRAND.colors.surfaceSoft,
            color: BRAND.colors.textPrimary,
            borderRadius: BRAND.radii.pill,
            padding: "8px 12px",
            fontSize: 13,
            cursor: "pointer",
            boxShadow: BRAND.shadow.soft,
          }}
        >
          ← Back
        </button>

        <div style={{ marginTop: 14 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: BRAND.colors.textSecondary,
              marginBottom: 8,
            }}
          >
            Step 1 of 4
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: BRAND.typography.displayFamily,
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.05,
              color: BRAND.colors.textPrimary,
            }}
          >
            Select Your Flight
          </h1>

          <div
            style={{
              marginTop: 10,
              color: BRAND.colors.textSecondary,
              fontSize: 14,
              lineHeight: 1.45,
              maxWidth: 640,
            }}
          >
            Choose one curated set. You’ll rate each wine and get a profile you
            can save for next time.
          </div>
        </div>
      </div>

      {/* Flight cards */}
      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {flights.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelectFlight(f.id)}
            style={{
              textAlign: "left",
              cursor: "pointer",
              padding: 18,
              borderRadius: BRAND.radii.card,
              border: `1px solid ${BRAND.colors.borderSoft}`,
              background: BRAND.colors.surface,
              boxShadow: BRAND.shadow.soft,
              transition: "transform 120ms ease, box-shadow 120ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                BRAND.shadow.card;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                BRAND.shadow.soft;
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: BRAND.colors.textPrimary,
                    marginBottom: 6,
                  }}
                >
                  {f.name}
                </div>

                <div
                  style={{
                    color: BRAND.colors.textSecondary,
                    fontSize: 14,
                    lineHeight: 1.45,
                    marginBottom: 12,
                  }}
                >
                  {f.description}
                </div>
              </div>

              {/* wine count pill */}
              <div
                style={{
                  flexShrink: 0,
                  borderRadius: BRAND.radii.pill,
                  padding: "6px 10px",
                  border: `1px solid ${BRAND.colors.accentSoft}`,
                  background: BRAND.colors.accentSoft,
                  color: BRAND.colors.accent,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                {f.wineCount} wines
              </div>
            </div>

            {/* subtle CTA hint */}
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: BRAND.colors.textSecondary,
                fontSize: 12,
              }}
            >
              <span>Tap to start</span>
              <span style={{ color: BRAND.colors.accent, fontWeight: 800 }}>
                Choose →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FlightSelectScreen;