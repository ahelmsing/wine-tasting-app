// src/App.tsx
import { useState } from "react";
import "./App.css";

// Data
import { FLIGHTS } from "./data/flights";

// Types (type-only import keeps TS happy if verbatimModuleSyntax is on)
import type { Session, ExperienceLevel, WineResponse, TagId } from "./app/state/session";

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

  // ExperienceLevelScreen expects: onChoose(level) + onBack()
  const onChooseExperience = (experienceLevel: ExperienceLevel) => {
    setSession((prev) => ({ ...prev, experienceLevel }));
    goToWine();
  };

  const onRestart = () => {
    setSession({
      flightId: null,
      experienceLevel: null,
      responsesByWineId: {},
    });
    goToWelcome();
  };

  // --- Helpers for WineScreen (your WineScreen takes a single wine + handlers) ---
  const selectedFlight = FLIGHTS.find((f) => f.id === session.flightId) ?? FLIGHTS[0];

  // If your flights data doesn’t include wines, we’ll generate placeholder wines
  const wines: Array<{ id: string; name: string; varietal: string; microStory: string }> =
    (selectedFlight as any).wines ??
    Array.from({ length: selectedFlight.wineCount ?? 4 }).map((_, i) => ({
      id: `${selectedFlight.id}-wine-${i + 1}`,
      name: `Wine ${i + 1}`,
      varietal: "Varietal",
      microStory:
        "A quick note about this pour. You’ll refine these later, but the flow works now.",
    }));

  const currentWineId =
    (session as any).currentWineId ??
    Object.keys(session.responsesByWineId)[0] ??
    wines[0]?.id;

  const currentIndex = Math.max(
    0,
    wines.findIndex((w) => w.id === currentWineId)
  );

  const currentWine = wines[currentIndex] ?? wines[0];

  const progressLabel = `STEP 3 OF 4 • WINE ${Math.min(currentIndex + 1, wines.length)} OF ${wines.length
    }`;

  const response: WineResponse =
    session.responsesByWineId[currentWine.id] ?? { rating: null, tags: [] };

  const setResponseForWine = (wineId: string, next: WineResponse) => {
    setSession((prev) => ({
      ...prev,
      responsesByWineId: {
        ...prev.responsesByWineId,
        [wineId]: next,
      },
      // keep currentWineId in session so refresh stays on same wine
      currentWineId: wineId,
    } as any));
  };

  const onToggleTag = (tag: TagId) => {
    const tags = response.tags ?? [];
    const nextTags = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    setResponseForWine(currentWine.id, { ...response, tags: nextTags });
  };

  const onSetRating = (rating: 1 | 2 | 3 | 4 | 5) => {
    setResponseForWine(currentWine.id, { ...response, rating });
  };

  const onNextWine = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= wines.length) {
      goToRecap();
      return;
    }
    const nextWine = wines[nextIndex];
    setSession((prev) => ({ ...(prev as any), currentWineId: nextWine.id } as any));
  };

  const onBackFromWine = () => {
    if (currentIndex <= 0) {
      goToExperience();
      return;
    }
    const prevWine = wines[currentIndex - 1];
    setSession((prev) => ({ ...(prev as any), currentWineId: prevWine.id } as any));
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
        <ExperienceLevelScreen onChoose={onChooseExperience} onBack={goToFlight} />
      );
      break;

    case "wine":
      screen = (
        <WineScreen
          wine={currentWine}
          progressLabel={progressLabel}
          response={response}
          onBack={onBackFromWine}
          onToggleTag={onToggleTag}
          onSetRating={onSetRating}
          onNext={onNextWine}
        />
      );
      break;

    case "recap":
      // RecapScreen varies between builds; keep it minimal + safe
      screen = <RecapScreen session={session} onRestart={onRestart} onBack={goToWine} />;
      break;

    default:
      screen = <div>Unknown screen</div>;
      break;
  }

  return <AppContainer>{screen}</AppContainer>;
}