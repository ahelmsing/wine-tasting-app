// src/App.tsx
import { useState } from "react";
import "./App.css";

// Data
import { FLIGHTS } from "./data/flights";

// Types (type-only import keeps TS happy if verbatimModuleSyntax is on)
import type { Session, ExperienceLevel } from "./app/state/session";

// Flexible imports: works whether the file exports default OR named
import * as WelcomeMod from "./screens/WelcomeScreen";
import * as FlightMod from "./screens/FlightSelectScreen";
import * as ExperienceMod from "./screens/ExperienceLevelScreen";
import * as WineMod from "./screens/WineScreen";
import * as RecapMod from "./screens/RecapScreen";

import * as AppContainerMod from "./components/layout/AppContainer";

// Pick default if it exists, otherwise use named export
const WelcomeScreen =
  (WelcomeMod as any).default ?? (WelcomeMod as any).WelcomeScreen;

const FlightSelectScreen =
  (FlightMod as any).default ?? (FlightMod as any).FlightSelectScreen;

const ExperienceLevelScreen =
  (ExperienceMod as any).default ?? (ExperienceMod as any).ExperienceLevelScreen;

const WineScreen = (WineMod as any).default ?? (WineMod as any).WineScreen;

const RecapScreen = (RecapMod as any).default ?? (RecapMod as any).RecapScreen;

const AppContainer =
  (AppContainerMod as any).default ?? (AppContainerMod as any).AppContainer;

type ScreenKey = "welcome" | "flight" | "experience" | "wine" | "recap";

export default function App() {
  const [screenKey, setScreenKey] = useState<ScreenKey>("welcome");

  const [session, setSession] = useState<Session>({
    flightId: null,
    experienceLevel: null,
    responsesByWineId: {},
  });

  // Navigation helpers
  const goToWelcome = () => setScreenKey("welcome");
  const goToFlight = () => setScreenKey("flight");
  const goToExperience = () => setScreenKey("experience");
  const goToWine = () => setScreenKey("wine");
  const goToRecap = () => setScreenKey("recap");

  const onBegin = () => goToFlight();

  const onSelectFlight = (flightId: string) => {
    setSession((prev) => ({ ...prev, flightId }));
    goToExperience();
  };

  const onSelectExperience = (experienceLevel: ExperienceLevel) => {
    setSession((prev) => ({ ...prev, experienceLevel }));
    goToWine();
  };

  const onUpdateSession = (nextSession: Session) => {
    setSession(nextSession);
  };

  const onRestart = () => {
    setSession({
      flightId: null,
      experienceLevel: null,
      responsesByWineId: {},
    });
    goToWelcome();
  };

  let screen: any = null;

  switch (screenKey) {
    case "welcome":
      screen = <WelcomeScreen onBegin={onBegin} />;
      break;

    case "flight":
      screen = (
        <FlightSelectScreen
          flights={FLIGHTS}
          onSelectFlight={onSelectFlight}
          onBack={goToWelcome}
        />
      );
      break;

    case "experience":
      screen = (
        <ExperienceLevelScreen
          onSelectExperience={onSelectExperience}
          onBack={goToFlight}
        />
      );
      break;

    case "wine":
      // WineScreen varies wildly between builds, so we pass the superset.
      // If it doesn’t use some props, it ignores them.
      screen = (
        <WineScreen
          session={session}
          onUpdateSession={onUpdateSession}
          onDone={goToRecap}
          onBack={goToExperience}
        />
      );
      break;

    case "recap":
      screen = (
        <RecapScreen session={session} onRestart={onRestart} onBack={goToWine} />
      );
      break;

    default:
      screen = <div>Unknown screen</div>;
      break;
  }

  // AppContainer also varies (default vs named), so we call it safely.
  return <AppContainer>{screen}</AppContainer>;
}