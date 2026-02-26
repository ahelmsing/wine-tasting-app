// src/app/state/stateMachine.ts

export type AppScreen =
  | "WELCOME"
  | "FLIGHT_SELECT"
  | "EXPERIENCE_LEVEL"
  | "WINE"
  | "RECAP";

export type AppState = {
  screen: AppScreen;
  wineIndex: number; // only meaningful when screen === "WINE"
};

export const initialAppState: AppState = {
  screen: "WELCOME",
  wineIndex: 0,
};

export function canGoBack(state: AppState): boolean {
  // No back from the first screen
  if (state.screen === "WELCOME") return false;

  // On the first wine, back should go to EXPERIENCE_LEVEL (not negative index)
  if (state.screen === "WINE" && state.wineIndex === 0) return true;

  // Otherwise yes
  return true;
}

export function goBack(state: AppState): AppState {
  switch (state.screen) {
    case "WELCOME":
      return state;

    case "FLIGHT_SELECT":
      return { screen: "WELCOME", wineIndex: 0 };

    case "EXPERIENCE_LEVEL":
      return { screen: "FLIGHT_SELECT", wineIndex: 0 };

    case "WINE":
      if (state.wineIndex > 0) {
        return { screen: "WINE", wineIndex: state.wineIndex - 1 };
      }
      return { screen: "EXPERIENCE_LEVEL", wineIndex: 0 };

    case "RECAP":
      // We’ll decide later if recap back goes to last wine or not.
      // For v1, keep it simple: go to last wine.
      return { screen: "WINE", wineIndex: Math.max(0, state.wineIndex) };

    default:
      return state;
  }
}

export function goNextFromWelcome(): AppState {
  return { screen: "FLIGHT_SELECT", wineIndex: 0 };
}

export function goNextFromFlightSelect(): AppState {
  return { screen: "EXPERIENCE_LEVEL", wineIndex: 0 };
}

export function goNextFromExperienceLevel(): AppState {
  return { screen: "WINE", wineIndex: 0 };
}

export function goNextWine(state: AppState, totalWinesInFlight: number): AppState {
  // totalWinesInFlight is 4–7 (validated elsewhere)
  const lastIndex = Math.max(0, totalWinesInFlight - 1);

  if (state.screen !== "WINE") return state;

  if (state.wineIndex >= lastIndex) {
    return { screen: "RECAP", wineIndex: lastIndex };
  }

  return { screen: "WINE", wineIndex: state.wineIndex + 1 };
}