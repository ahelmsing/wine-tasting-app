// src/app/state/session.ts

export type ExperienceLevel = "NEW" | "SOME" | "PRO";

export type TagId =
  | "FRUITY"
  | "FLORAL"
  | "EARTHY"
  | "SPICY"
  | "SWEET"
  | "CRISP"
  | "SMOOTH"
  | "BOLD";

export type WineResponse = {
  rating: 1 | 2 | 3 | 4 | 5 | null; // required to proceed, but can be null before selection
  tags: TagId[]; // 0–3
};

export type Session = {
  // Selected by user
  flightId: string | null;
  experienceLevel: ExperienceLevel | null;

  // Per-wine answers
  responsesByWineId: Record<string, WineResponse>;
};

export const initialSession: Session = {
  flightId: null,
  experienceLevel: null,
  responsesByWineId: {},
};

export function clampTags(tags: TagId[]): TagId[] {
  // Enforce max 3, preserve order, no duplicates
  const out: TagId[] = [];
  for (const t of tags) {
    if (out.includes(t)) continue;
    out.push(t);
    if (out.length === 3) break;
  }
  return out;
}

export function toggleTag(current: TagId[], tag: TagId): TagId[] {
  const has = current.includes(tag);
  if (has) return current.filter((t) => t !== tag);

  // Add, but clamp to max 3
  return clampTags([...current, tag]);
}

export function setWineRating(
  session: Session,
  wineId: string,
  rating: 1 | 2 | 3 | 4 | 5
): Session {
  const existing = session.responsesByWineId[wineId] ?? { rating: null, tags: [] as TagId[] };

  return {
    ...session,
    responsesByWineId: {
      ...session.responsesByWineId,
      [wineId]: {
        ...existing,
        rating,
      },
    },
  };
}

export function toggleWineTag(session: Session, wineId: string, tag: TagId): Session {
  const existing = session.responsesByWineId[wineId] ?? { rating: null, tags: [] as TagId[] };

  return {
    ...session,
    responsesByWineId: {
      ...session.responsesByWineId,
      [wineId]: {
        ...existing,
        tags: toggleTag(existing.tags, tag),
      },
    },
  };
}

export function setFlight(session: Session, flightId: string): Session {
  return {
    ...session,
    flightId,
    // When flight changes, we reset responses (keeps behavior predictable)
    responsesByWineId: {},
  };
}

export function setExperienceLevel(session: Session, level: ExperienceLevel): Session {
  return {
    ...session,
    experienceLevel: level,
  };
}