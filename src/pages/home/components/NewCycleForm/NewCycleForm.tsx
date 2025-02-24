import { useFormContext } from "react-hook-form";
import { FormContainer, MinutesInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CycleContext } from "../../../../contexts/CycleContext";

export function NewCycleForm() {
    const { activedCycle } = useContext(CycleContext);
    const form = useFormContext();

    return (
        <FormContainer>
            <label htmlFor="task">Vou trabalhar em</label>
            <TaskInput id="task" list="list-input" type="text" placeholder="Dê um nome ao seu projeto" 
            {...form.register('task')} disabled={!!activedCycle} />
            <datalist id="list-input">
                <option value="Projeto 1" />
                <option value="Projeto 2" />
                <option value="Projeto 3" />
            </datalist>
            <label htmlFor="minutesAmount">durante</label>
            <MinutesInput id="minutesAmount" type="number" placeholder="00" step={5} min={1} max={60} 
                {...form.register('minutesAmount', { valueAsNumber: true })} disabled={!!activedCycle} />
            <span>minutos.</span>
        </FormContainer>
    )
}