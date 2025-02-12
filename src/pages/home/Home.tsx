import { HandPalm, Play } from "phosphor-react";
import { Button, ButtonStop, CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(1).max(60)
})

type NewCycleFormat = zod.infer<typeof newCycleFormSchema>

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedDate?: Date,
    finishedDate?: Date
}

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

    const totalSeconds = activedCycle ? activedCycle.minutesAmount * 60 : 0;

    useEffect(() => {
        let interval: number;
        if(activedCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activedCycle.startDate);
                if(secondsDifference >= totalSeconds) {
                    setCycles(state => state.map(cycle => {
                        if(cycle.id === activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                        } else {
                            return cycle;
                        }
                    }));
                    setAmountSecondsPassed(totalSeconds);
                    setActiveCycleId(null);
                    clearInterval(interval);
                } else {
                    setAmountSecondsPassed(secondsDifference)
                }
            }, 1000)
        }
        return () => {
            clearInterval(interval);
        }
    }, [activedCycle, totalSeconds, activeCycleId]);

    const currentSeconds = activedCycle ? totalSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    useEffect(() => {
        if(activedCycle) {
            document.title = `${minutes}:${seconds}`;
        }
    }, [minutes, seconds, activedCycle]);

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
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput id="task" list="list-input" type="text" placeholder="Dê um nome ao seu projeto" 
                        {...form.register('task')} disabled={!!activedCycle} />
                    <datalist id="list-input">
                        <option value="Prejeto 1" />
                        <option value="Prejeto 2" />
                        <option value="Prejeto 3" />
                    </datalist>
                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesInput id="minutesAmount" type="number" placeholder="00" step={5} min={1} max={60} 
                        {...form.register('minutesAmount', { valueAsNumber: true })} disabled={!!activedCycle} />
                    <span>minutos.</span>
                </FormContainer>
            

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

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