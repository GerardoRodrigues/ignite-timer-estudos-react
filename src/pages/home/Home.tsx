import { HandPalm, Play } from "phosphor-react";
import { Button, ButtonStop, HomeContainer } from "./styles";
import { useState, createContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm/NewCycleForm";
import { Countdown } from "./components/Countdown/Countdown";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

interface CyclesContextType {
    activedCycle: Cycle | undefined,
    activeCycleId: string | null,
    amountSecondsPassed: number,
    markCurrentCycleFinished: () => void,
    setSecondsByPassed: (seconds: number) => void,
}

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(1).max(60)
})

type NewCycleFormat = zod.infer<typeof newCycleFormSchema>

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const form = useForm<NewCycleFormat>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const task = form.watch('task');
    const isSubmitDisabled = !task;

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
        form.reset();
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

    return(
        <HomeContainer>
            <form onSubmit={form.handleSubmit(onSubmit)} action="">
            <CyclesContext.Provider value={{ activedCycle, activeCycleId, markCurrentCycleFinished, amountSecondsPassed, setSecondsByPassed }}>
                <FormProvider {...form}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
            </CyclesContext.Provider>
                {activedCycle ? (
                    <ButtonStop type="button" onClick={interrupCycle}>
                        <HandPalm size={24}/>
                        Interromper
                    </ButtonStop>
                ) : (
                    <Button type="submit" disabled={isSubmitDisabled}>
                        <Play size={24}/>
                        Começar
                    </Button>
                )}
            </form>
        </HomeContainer>
    )
}