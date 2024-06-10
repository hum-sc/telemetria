import { ChartData, Point } from "chart.js";
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  
  } from "chart.js";
import { error, outline, primary, secondary, tertiary } from "~/utils/colores"
import { useEffect, useState } from "react";
  
  
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

export type config = {
    type: 'line'|string,
    data:{},
    options:{},
    plugins:[],
}

export type dataSet = {
    label: string;
    data: any[];
};

export default function GraficaLineas(props:{ 
    id?:string, 
    className?:string, 
    title:string, 
    dataSets:dataSet[],
    labels:string[]
    fill?:boolean,
    noLabels?:boolean
}) {
    const [lineaColores, setLineaColores] = useState<string[]>([]);
    const [data, setData] = useState<{
        labels:string[],
        datasets:any[],
    }>({labels:[], datasets:[]});
   
    const config = {
        responsive: true,
        maintainAspectRatio: false,
        lineTension:0.6,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend:{
                position:'bottom' as const,
                display: !props.noLabels,
            },
            title:{
                display:false,
                text:props.title,
            },
            
        }
        // sin puntos
        ,elements: {
            point: {
                radius: 0
            }
        }, animation:{
            duration: 0,
        },legend:{
            display:false
        }
    }
    useEffect(() => {
        setLineaColores([primary(), tertiary(), secondary(), outline(), error()]);
    }, [])

    useEffect(() => {
        setData( {
            labels: props.labels,
            datasets: props.dataSets.map((dataSet,i) =>{
                if(i > lineaColores.length) i = i%lineaColores.length;
                return {
                    label: dataSet.label,
                    data: dataSet.data,
                    fill: props.fill,
                    backgroundColor: lineaColores[i],
                    borderColor: lineaColores[i],
                    tension: 0.2
                }
            }) 
        });
    }, [props.dataSets, lineaColores])
    
    return (
        <div className={"grafico background "+props.className} id={props.id}>
        <Line data={data} options={config}/>
        </div>
    )
}