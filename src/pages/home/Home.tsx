import { Play } from "phosphor-react";
import { Button, CountdownContainer, FormContainer, HomeContainer, MinutesInput, Separator, TaskInput } from "./styles";

export function Home() {
    return(
        <HomeContainer>
            <form action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput id="task" list="list-input" type="text" placeholder="Dê um nome ao seu projeto" />
                    <datalist id="list-input">
                        <option value="Prejeto 1" />
                        <option value="Prejeto 2" />
                        <option value="Prejeto 3" />
                    </datalist>
                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesInput id="minutesAmount" type="number" placeholder="00" step={5} min={5} max={60} />
                    <span>minutos.</span>
                </FormContainer>
            

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <Button type="submit">
                    <Play size={24}/>
                    Começar
                </Button>
            </form>
        </HomeContainer>
    )
}