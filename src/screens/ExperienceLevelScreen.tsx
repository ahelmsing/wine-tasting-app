// src/screens/ExperienceLevelScreen.tsx

import type { ExperienceLevel } from "../app/state/session";

type Props = {
  onChoose: (level: ExperienceLevel) => void;
  onBack: () => void;
};

export function ExperienceLevelScreen({ onChoose, onBack }: Props) {
  return (
    <div style={{ padding: 32 }}>
      <button onClick={onBack} style={{ marginBottom: 16 }}>
        ← Back
      </button>

      <h1 style={{ margin: 0 }}>Is this your first wine tasting?</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <button
          onClick={() => onChoose("NEW")}
          style={{
            textAlign: "left",
            padding: 16,
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700 }}>I’m new</div>
          <div style={{ marginTop: 6, color: "#6B7280", fontSize: 14 }}>
            Keep it simple and friendly.
          </div>
        </button>

        <button
          onClick={() => onChoose("SOME")}
          style={{
            textAlign: "left",
            padding: 16,
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700 }}>I’ve done a few</div>
          <div style={{ marginTop: 6, color: "#6B7280", fontSize: 14 }}>
            A little guidance, no lectures.
          </div>
        </button>

        <button
          onClick={() => onChoose("PRO")}
          style={{
            textAlign: "left",
            padding: 16,
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700 }}>I know my wine</div>
          <div style={{ marginTop: 6, color: "#6B7280", fontSize: 14 }}>
            Skip the basics.
          </div>
        </button>
      </div>
    </div>
  );
}