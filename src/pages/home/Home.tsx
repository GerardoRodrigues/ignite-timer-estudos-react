import { HandPalm, Play } from "phosphor-react";
import { Button, ButtonStop, HomeContainer } from "./styles";
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm/NewCycleForm";
import { Countdown } from "./components/Countdown/Countdown";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { CycleContext } from "../../contexts/CycleContext";



const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(1).max(60)
})

type NewCycleFormat = zod.infer<typeof newCycleFormSchema>

export function Home() {
    
    const { activedCycle, onSubmit, interrupCycle } = useContext(CycleContext);

    const form = useForm<NewCycleFormat>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const task = form.watch('task');
    const isSubmitDisabled = !task;

    return(
        <HomeContainer>
            <form onSubmit={form.handleSubmit(onSubmit)} action="">
                <FormProvider {...form}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
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