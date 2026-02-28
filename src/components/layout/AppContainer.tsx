// src/components/layout/AppContainer.tsx
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
        backgroundImage:
          "radial-gradient(900px 600px at 50% 15%, rgba(255,255,255,0.06), transparent 60%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "clamp(16px, 4vw, 40px) clamp(12px, 3vw, 20px)",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          minWidth: 0,
        }}
      >
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
              overflow: "hidden", // needed so texture respects rounded corners
            }}
          >
            {/* Subtle paper texture layer */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                borderRadius: BRAND.radii.page,

                // very subtle grain + soft edge depth
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 0.6px, transparent 0.7px),
                  radial-gradient(circle at 75% 65%, rgba(0,0,0,0.025) 0.6px, transparent 0.7px),
                  radial-gradient(circle at 40% 80%, rgba(0,0,0,0.02) 0.6px, transparent 0.7px),
                  radial-gradient(1200px 900px at 50% 110%, rgba(0,0,0,0.05), transparent 60%)
                `,
                backgroundSize: `
                  200px 200px,
                  240px 240px,
                  260px 260px,
                  auto
                `,
                backgroundRepeat: `
                  repeat,
                  repeat,
                  repeat,
                  no-repeat
                `,
                opacity: 0.45,
                mixBlendMode: "multiply",
              }}
            />

            {/* content */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                padding:
                  padding === 48
                    ? "clamp(18px, 4vw, 48px)"
                    : `clamp(18px, 4vw, ${padding}px)`,
                boxSizing: "border-box",
                minWidth: 0,
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