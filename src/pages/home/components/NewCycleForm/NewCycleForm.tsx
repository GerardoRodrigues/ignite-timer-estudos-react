import { useFormContext } from "react-hook-form";
import { FormContainer, MinutesInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "../../Home";

export function NewCycleForm() {
    const { activedCycle } = useContext(CyclesContext);
    const form = useFormContext();

    return (
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
    )
}