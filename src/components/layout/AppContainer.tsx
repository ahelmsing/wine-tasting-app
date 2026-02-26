import type { ReactNode } from "react";
import { BRAND } from "../../styles/brand";

type Props = {
  children: ReactNode;
  maxWidth?: number;
  padding?: number; // used only when paper=true
  paper?: boolean; // when false, AppContainer won't render the cream "paper card"
};

export function AppContainer({
  children,
  maxWidth = 980,
  padding = 48,
  paper = true,
}: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: BRAND.colors.bgPlum,
        // subtle center glow so the page feels less flat
        backgroundImage:
          "radial-gradient(900px 600px at 50% 15%, rgba(255,255,255,0.06), transparent 60%)",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth }}>
        {paper ? (
          <div
            style={{
              width: "100%",
              background: BRAND.colors.paper,
              borderRadius: BRAND.radii.page,
              boxSizing: "border-box",
              boxShadow: BRAND.shadow.card,
              border: `1px solid ${BRAND.colors.borderSoft}`,
              position: "relative",
            }}
          >


            {/* content */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                // responsive-ish padding without media queries
                padding:
                  padding === 48
                    ? "clamp(20px, 4vw, 48px)"
                    : `clamp(20px, 4vw, ${padding}px)`,
                boxSizing: "border-box",
              }}
            >
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}