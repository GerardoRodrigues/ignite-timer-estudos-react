import { createContext, useReducer, useState } from "react";

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

interface CyclesState {
    cycles: Cycle[],
    activeCycleId: string | null
}

export const CycleContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CyclesProviderProps) {
    const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
        switch(action.type) {
            case "ADD_CYCLE":
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id
                };
            case "INTERRUPUP_CYCLE":
                return {
                    ...state,
                    cycles: state.cycles.map(cycle => {
                        if(cycle.id === state.activeCycleId) {
                            return {...cycle, interruptedDate: new Date()}
                        } else {
                            return cycle;
                        }
                    }),
                    activeCycleId: null
                }
            case "FINISH_CYCLE":
                return {
                   ...state,
                    cycles: state.cycles.map(cycle => {
                        if(cycle.id === state.activeCycleId) {
                            return {...cycle, finishedDate: new Date()}
                        } else {
                            return cycle;
                        }
                    }),
                    activeCycleId: null
                }
            default:
                return state;
        }
    }, {
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
        dispatch({
            type: "FINISH_CYCLE",
            payload: {
                activeCycleId
            } 
                
        })
    }

    function onSubmit(data: NewCycleFormat) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        dispatch({ type: "ADD_CYCLE", payload: {newCycle} });
        setAmountSecondsPassed(0);
    }

    function interrupCycle() {
        dispatch({
            type: "INTERRUPUP_CYCLE",
            payload: activeCycleId
        })
    }

    return (
        <CycleContext.Provider value={{ cycles, activedCycle, activeCycleId, markCurrentCycleFinished, amountSecondsPassed, setSecondsByPassed, onSubmit, interrupCycle }}>
            {children}
        </CycleContext.Provider>
    )
}