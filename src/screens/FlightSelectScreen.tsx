// src/screens/FlightSelectScreen.tsx

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
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack} style={{ marginBottom: 16 }}>
          ← Back
        </button>
        <h1 style={{ margin: 0 }}>Select Your Flight</h1>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {flights.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelectFlight(f.id)}
            style={{
              textAlign: "left",
              padding: 16,
              borderRadius: 16,
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>{f.name}</div>
            <div style={{ marginTop: 8 }}>{f.description}</div>
            <div style={{ marginTop: 8, color: "#6B7280", fontSize: 14 }}>
              {f.wineCount} wines
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}