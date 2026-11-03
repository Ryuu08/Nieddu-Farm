export type ProductionResource = "milk" | "wool";

export interface ProductionState {
  resource: ProductionResource;
  durationMs: number;
  elapsedMs: number;
  ready: boolean;
}
