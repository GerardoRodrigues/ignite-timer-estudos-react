import { Play } from "phosphor-react";
import { Button, CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';

const newCycleFormSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormat = zod.infer<typeof newCycleFormSchema>

export function Home() {
    const form = useForm<NewCycleFormat>({
        resolver: zodResolver(newCycleFormSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const task = form.watch('task');
    const isSubmitDisabled = !task;
    
    function onSubmit(data: NewCycleFormat) {
        console.log(data);
        form.reset();
    }

    return(
        <HomeContainer>
            <form onSubmit={form.handleSubmit(onSubmit)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput id="task" list="list-input" type="text" placeholder="Dê um nome ao seu projeto" 
                        {...form.register('task')} />
                    <datalist id="list-input">
                        <option value="Prejeto 1" />
                        <option value="Prejeto 2" />
                        <option value="Prejeto 3" />
                    </datalist>
                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesInput id="minutesAmount" type="number" placeholder="00" step={5} min={5} max={60} 
                        {...form.register('minutesAmount', { valueAsNumber: true })} />
                    <span>minutos.</span>
                </FormContainer>
            

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <Button type="submit" disabled={isSubmitDisabled}>
                    <Play size={24}/>
                    Começar
                </Button>
            </form>
        </HomeContainer>
    )
}