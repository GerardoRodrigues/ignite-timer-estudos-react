import { produce } from "immer";
import { ActionTypes } from "./actions";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_CYCLE:
      return produce(state, draft => {
        draft.cycles.push(action.payload.newCycle);
        draft.activeCycleId = action.payload.newCycle.id;
      })
    case ActionTypes.INTERRUPT_CYCLE: {
      const currentCycleIdIndex = state.cycles.findIndex(cycle => {
        return cycle.id === state.activeCycleId;
      });

      if(currentCycleIdIndex < 0) {
        return state;
      }

      return produce(state, draft => {
        draft.cycles[currentCycleIdIndex].interruptedDate = new Date();
        draft.activeCycleId = null;
      })
    }
    case ActionTypes.FINISH_CYCLE: {
      const currentCycleIdIndex = state.cycles.findIndex(cycle => {
        return cycle.id === state.activeCycleId;
      });

      if(currentCycleIdIndex < 0) {
        return state;
      }

      return produce(state, draft => {
        draft.cycles[currentCycleIdIndex].finishedDate = new Date();
        draft.activeCycleId = null;
      })
    }
    default:
      return state;
  }
}