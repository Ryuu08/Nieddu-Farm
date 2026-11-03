import { ProductionResource } from "../types/Production";

export interface SheepProductionConfig {
  resource: ProductionResource;
  baseDurationMs: number;
  baseQuantity: number;
}

export const SHEEP_PRODUCTION: SheepProductionConfig[] = [
  {
    resource: "milk",
    baseDurationMs: 30_000,
    baseQuantity: 1,
  },
  {
    resource: "wool",
    baseDurationMs: 45_000,
    baseQuantity: 1,
  },
];
