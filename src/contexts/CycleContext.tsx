import { createContext, useState } from "react";

interface NewCycleFormat {
    task: string,
    minutesAmount: number
}

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
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
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const activedCycle = cycles.find(cycle => cycle.id === activeCycleId);

    
    function setSecondsByPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function markCurrentCycleFinished() {
        setCycles(state => state.map(cycle => {
            if(cycle.id === activeCycleId) {
                return { 
                   ...cycle, 
                    finishedDate: new Date()
                }
            } else {
                return cycle;
            }
        }));
        setActiveCycleId(null);
    }

    function onSubmit(data: NewCycleFormat) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        setCycles(state => [...state, newCycle]);
        setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
        //form.reset();
    }

    function interrupCycle() {
        setCycles(state => state.map(cycle => {
            if(cycle.id === activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
            } else {
                return cycle;
            }
        }));
        setActiveCycleId(null);
    }

    return (
        <CycleContext.Provider value={{ cycles, activedCycle, activeCycleId, markCurrentCycleFinished, amountSecondsPassed, setSecondsByPassed, onSubmit, interrupCycle }}>
            {children}
        </CycleContext.Provider>
    )
}