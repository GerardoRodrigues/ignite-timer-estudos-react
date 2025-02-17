import { createContext, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/Cycles/cycles";
import { addNewCycleAction, finishCycleAction, interruptCycleAction } from "../reducers/Cycles/actions";

interface NewCycleFormat {
    task: string,
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[],
    activedCycle: Cycle | undefined,
    activeCycleId: string | null,
    amountSecondsPassed: number,
    markCurrentCycleFinished: () => void,
    setSecondsByPassed: (seconds: number) => void,
    onSubmit: (data: NewCycleFormat) => void,
    interrupCycle: () => void
}

interface CyclesProviderProps {
    children: React.ReactNode
}

export const CycleContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CyclesProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { cycles, activeCycleId } = cyclesState;

    const activedCycle = cycles.find(cycle => cycle.id === activeCycleId);

    
    function setSecondsByPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleFinished() {
        dispatch(finishCycleAction())
    }

    function onSubmit(data: NewCycleFormat) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        dispatch(addNewCycleAction(newCycle));
        setAmountSecondsPassed(0);
    }

    function interrupCycle() {
        dispatch(interruptCycleAction())
    }

    return (
        <CycleContext.Provider value={{ cycles, activedCycle, activeCycleId, markCurrentCycleFinished, amountSecondsPassed, setSecondsByPassed, onSubmit, interrupCycle }}>
            {children}
        </CycleContext.Provider>
    )
}