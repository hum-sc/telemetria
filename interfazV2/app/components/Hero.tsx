import { useEffect, useState } from "react";
import InformacionGeneral from "./InformacionGeneral";
import Title from "./Title";

export default function Hero(){
    const [time, setTime] = useState("");

    const updateTime = () =>{
        setTime(new Date().toLocaleTimeString());
        
    };

    useEffect(() => {
        updateTime();
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval);
    }, []);
    return(
        <header className="hero">
            <Title/>
            <div className="dataContainer">
                <InformacionGeneral label="Fecha" content={new Date().toLocaleDateString()} type="filled" variant="default"/>
                <InformacionGeneral label="Hora" content={time} type="filled" variant="default"/>
            </div>
        </header>
    )
}