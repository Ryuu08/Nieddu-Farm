import { ProductionState } from "../types/Production";

export class ProductionSystem {
  public update(state: ProductionState, deltaMs: number): void {
    if (state.ready || deltaMs <= 0) {
      return;
    }

    state.elapsedMs = Math.min(state.elapsedMs + deltaMs, state.durationMs);
    state.ready = state.elapsedMs >= state.durationMs;
  }

  public collect(state: ProductionState): boolean {
    if (!state.ready) {
      return false;
    }

    state.elapsedMs = 0;
    state.ready = false;
    return true;
  }
}
