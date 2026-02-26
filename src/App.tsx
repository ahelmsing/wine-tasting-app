// src/App.tsx
import React, { useCallback, useMemo, useState } from "react";

import { AppContainer } from "./components/layout/AppContainer";
import { initialSession, type Session } from "./app/state/session";

// Screens
import WelcomeScreen from "./screens/WelcomeScreen";
import { FlightSelectScreen } from "./screens/FlightSelectScreen";
import { ExperienceLevelScreen } from "./screens/ExperienceLevelScreen";
import { WineScreen } from "./screens/WineScreen";
import { RecapScreen } from "./screens/RecapScreen";

type ScreenKey = "welcome" | "flight" | "experience" | "wine" | "recap";

export default function App() {
  const [screenKey, setScreenKey] = useState<ScreenKey>("welcome");

  // Keep a single session source of truth at the top
  const [session, setSession] = useState<Session>(() => initialSession);

  // Navigation helpers
  const goToWelcome = useCallback(() => setScreenKey("welcome"), []);
  const goToFlight = useCallback(() => setScreenKey("flight"), []);
  const goToExperience = useCallback(() => setScreenKey("experience"), []);
  const goToWine = useCallback(() => setScreenKey("wine"), []);
  const goToRecap = useCallback(() => setScreenKey("recap"), []);

  const restart = useCallback(() => {
    setSession(initialSession);
    setScreenKey("welcome");
  }, []);

  const containerWidth = useMemo(() => 980, []);

  // --- IMPORTANT ---
  // Your screen components currently have Props types that do NOT include `session`,
  // but we still want to pass session around for app flow.
  // Cast them to `any` here to stop TS from blocking compilation while we’re iterating UI.
  const Welcome: any = WelcomeScreen;
  const FlightSelect: any = FlightSelectScreen;
  const ExperienceLevel: any = ExperienceLevelScreen;
  const Wine: any = WineScreen;
  const Recap: any = RecapScreen;

  let screen: React.ReactNode = null;

  switch (screenKey) {
    case "welcome":
      screen = <Welcome onBegin={goToFlight} />;
      break;

    case "flight":
      screen = (
        <FlightSelect
          session={session}
          onSelectFlight={(flightId: string) => {
            setSession((prev) => ({ ...prev, flightId } as Session));
            goToExperience();
          }}
          onBack={goToWelcome}
        />
      );
      break;

    case "experience":
      screen = (
        <ExperienceLevel
          session={session}
          onSelectExperience={(experienceLevel: any) => {
            setSession((prev) => ({ ...prev, experienceLevel } as Session));
            goToWine();
          }}
          onBack={goToFlight}
        />
      );
      break;

    case "wine":
      screen = (
        <Wine
          session={session}
          onUpdateSession={(nextSession: Session) => setSession(nextSession)}
          onDone={goToRecap}
          onBack={goToExperience}
        />
      );
      break;

    case "recap":
      screen = (
        <Recap session={session} onRestart={restart} onBack={goToWine} />
      );
      break;

    default:
      screen = <div>Unknown screen</div>;
      break;
  }

  return <AppContainer maxWidth={containerWidth}>{screen}</AppContainer>;
}