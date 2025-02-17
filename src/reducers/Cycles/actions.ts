import { Cycle } from "./cycles";

export enum ActionTypes {
  ADD_CYCLE = "ADD_CYCLE",
  INTERRUPT_CYCLE = "INTERRUPT_CYCLE",
  FINISH_CYCLE = "FINISH_CYCLE",
}

export function addNewCycleAction(newCycle: Cycle) {
  return { type: ActionTypes.ADD_CYCLE, payload: { newCycle } };
}

export function interruptCycleAction() {
  return { type: ActionTypes.INTERRUPT_CYCLE };
}

export function finishCycleAction() {
  return { type: ActionTypes.FINISH_CYCLE };
}
