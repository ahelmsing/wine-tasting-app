import type { ReactNode } from "react";
import { BRAND } from "../../styles/brand";

type Props = {
  children: ReactNode;
  maxWidth?: number;
  padding?: number; // used only when paper=true
  paper?: boolean;  // NEW: when false, AppContainer won't render the cream "paper card"
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
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth }}>
        {paper ? (
          // "Paper" card wrapper (cream)
          <div
            style={{
              width: "100%",
              background: BRAND.colors.paper,
              borderRadius: BRAND.radii.page,
              padding,
              boxSizing: "border-box",
              boxShadow: BRAND.shadow.card,
              border: `1px solid ${BRAND.colors.borderSoft}`,
            }}
          >
            {children}
          </div>
        ) : (
          // No paper card — just centered content
          children
        )}
      </div>
    </div>
  );
}