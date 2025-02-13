import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CycleContext } from "../../../../contexts/CycleContext";


export function Countdown() {
    const {activedCycle, activeCycleId, markCurrentCycleFinished, amountSecondsPassed, setSecondsByPassed} = useContext(CycleContext)

    const totalSeconds = activedCycle ? activedCycle.minutesAmount * 60 : 0;

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

    useEffect(() => {
        let interval: number;
        if(activedCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activedCycle.startDate);
                if(secondsDifference >= totalSeconds) {
                    markCurrentCycleFinished();
                    setSecondsByPassed(totalSeconds);
                    clearInterval(interval);
                } else {
                    setSecondsByPassed(secondsDifference)
                }
            }, 1000)
        }
        return () => {
            clearInterval(interval);
        }
    }, [activedCycle, totalSeconds, activeCycleId, markCurrentCycleFinished]);

    return(
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}