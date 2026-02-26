import { BRAND } from "../styles/brand";

type Props = {
  onBegin: () => void;
};

export default function WelcomeScreen({ onBegin }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: BRAND.colors.bgPlum,
      }}
    >
      {/* Full-bleed video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/media/wine-pour.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75))",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 32,
          boxSizing: "border-box",
          color: "rgba(255,255,255,0.92)",
        }}
      >
        {/* Top-left */}
        <div
          style={{
            letterSpacing: "0.22em",
            fontSize: 12,
            textTransform: "uppercase",
            alignSelf: "flex-start",
            textAlign: "left",
          }}
        >
          WELCOME TO
        </div>

        {/* Bottom-right block */}
        <div style={{ alignSelf: "flex-end", maxWidth: 440 }}>
          <div
            style={{
              fontFamily: BRAND.typography.displayFamily,
              fontWeight: 700,
              fontSize: 72,
              lineHeight: 0.92,
              textAlign: "right",
            }}
          >
            Your
            <br />
            Tasting
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 14,
              lineHeight: 1.5,
              textAlign: "right",
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Rate each wine, pick what stands out, and get a simple profile you
            can save for your next visit.
          </div>

          <div style={{ marginTop: 24, textAlign: "right" }}>
            <button
              onClick={onBegin}
              style={{
                width: 240,
                padding: "14px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Begin
            </button>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              textAlign: "right",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Tip: pick up to 3 tags per wine.
          </div>
        </div>
      </div>
    </div>
  );
}