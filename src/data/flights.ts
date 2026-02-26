// src/data/flights.ts

export type Flight = {
  id: string;
  name: string;
  description: string;
  wineCount: number;
};

export const FLIGHTS: Flight[] = [
  { id: "flight-a", name: "Flight A", description: "A balanced mix to get started.", wineCount: 4 },
  { id: "flight-b", name: "Flight B", description: "Fruit-forward and easy-drinking.", wineCount: 4 },
  { id: "flight-c", name: "Flight C", description: "Bolder reds and deeper notes.", wineCount: 4 },
  { id: "flight-d", name: "Flight D", description: "A surprise set for adventurous palates.", wineCount: 4 },
];