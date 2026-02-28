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
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",

        // Tiny “safety inset” so cards never feel glued to the paper edge on phones
        // (small enough that it won’t feel like double padding)
        paddingInline: "clamp(6px, 1.8vw, 12px)",
        paddingBlock: 0,

        boxSizing: "border-box",
        minWidth: 0,
      }}
    >
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
            whiteSpace: "nowrap",
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
              textAlign: "center",
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
              textAlign: "center",
            }}
          >
            Select Your Flight
          </h1>

          <div
            style={{
              margin: "10px auto 0",
              color: BRAND.colors.textSecondary,
              fontSize: 14,
              lineHeight: 1.45,
              maxWidth: 640,
              textAlign: "center",
            }}
          >
            Choose one curated set. You’ll rate each wine and get a profile you
            can save for next time.
          </div>
        </div>
      </div>

      {/* Flight cards */}
      <div className="flight-grid">
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
              width: "100%",
              boxSizing: "border-box",
              minWidth: 0,
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
            {/* KEY FIX:
                Put name + pill on top row, then description spans full width below.
                This prevents the pill from stealing width and causing ugly wrapping. */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gridTemplateRows: "auto auto",
                columnGap: 12,
                rowGap: 10,
                alignItems: "start",
                minWidth: 0,
              }}
            >
              {/* Name */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: BRAND.colors.textPrimary,
                  minWidth: 0,
                }}
              >
                {f.name}
              </div>

              {/* wine count pill */}
              <div
                style={{
                  justifySelf: "end",
                  alignSelf: "start",
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

              {/* Description (full width) */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  color: BRAND.colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.45,
                  minWidth: 0,
                }}
              >
                {f.description}
              </div>
            </div>

            {/* CTA hint (keep ONLY Choose →) */}
            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "flex-end",
                color: BRAND.colors.textSecondary,
                fontSize: 12,
              }}
            >
              <span style={{ color: BRAND.colors.accent, fontWeight: 800 }}>
                Choose →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* responsive grid rules */}
      <style>
        {`
          .flight-grid {
            display: grid;
            gap: 14px;
            grid-template-columns: 1fr;
          }

          @media (min-width: 820px) {
            .flight-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
        `}
      </style>
    </div>
  );
}

export default FlightSelectScreen;