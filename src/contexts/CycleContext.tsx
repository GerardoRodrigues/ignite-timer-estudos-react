import { createContext, useEffect, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/Cycles/reducer";
import {
  addNewCycleAction,
  finishCycleAction,
  interruptCycleAction,
} from "../reducers/Cycles/actions";
import { differenceInSeconds } from "date-fns";

interface NewCycleFormat {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activedCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleFinished: () => void;
  setSecondsByPassed: (seconds: number) => void;
  onSubmit: (data: NewCycleFormat) => void;
  interrupCycle: () => void;
}

interface CyclesProviderProps {
  children: React.ReactNode;
}

export const CycleContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CyclesProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  }, (initialState) => {
    const stateJson = localStorage.getItem("@ignite-timer:cycles-state");
    if (stateJson) {
      return JSON.parse(stateJson);
    }
    return initialState;
  });

  const { cycles, activeCycleId } = cyclesState;

  const activedCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if(activedCycle) {
        return differenceInSeconds(new Date(), new Date(activedCycle.startDate));
    }
    return 0
  });

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState);
    localStorage.setItem("@ignite-timer:cycles-state", stateJson);
  }, [cyclesState])

  function setSecondsByPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleFinished() {
    dispatch(finishCycleAction());
  }

  function onSubmit(data: NewCycleFormat) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };
    dispatch(addNewCycleAction(newCycle));
    setAmountSecondsPassed(0);
  }

  function interrupCycle() {
    dispatch(interruptCycleAction());
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activedCycle,
        activeCycleId,
        markCurrentCycleFinished,
        amountSecondsPassed,
        setSecondsByPassed,
        onSubmit,
        interrupCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}
