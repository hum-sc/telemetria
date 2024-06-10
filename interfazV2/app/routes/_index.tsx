import { Sensor } from "@prisma/client";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";
import Hero from "~/components/Hero";
import GraficaLineas, { dataSet } from "~/components/Linea";
import { getData, registrarSensor } from "~/.server/db";
import ErrorDialog from "~/components/ErrorDialog";
import ExtendedFAB from "~/components/ExtendedFAB";
import { AgregarSensorOverlay } from "~/components/AgregarSensorOverlay";
import audiourl from "~/audio/alerta.mp3?url";

export let timegap = 1000;
export let timeLimit = 1*60*1000;
const agregarSensor = async (form:FormData)=>{
  const url = form.get("url") as string;
  const nombre = form.get("nombre") as string;
  let umbralAlerta: string|number = form.get("umbralAlerta") as string;
  umbralAlerta = parseFloat(umbralAlerta);
  let umbralPeligro: string|number = form.get("umbralPeligro") as string;
  umbralPeligro = parseFloat(umbralPeligro);
  const unidadMedida = form.get("unidadMedida") as string;

  // Si todos los campos tienen valor continua, si no regresa un error
  if (!url || !nombre || !umbralAlerta || !umbralPeligro || !unidadMedida) {
      return {
          status: 400,
          formError: "Todos los campos son obligatorios"
      }
  }

  const sensor = {
      url: url,
      nombre: nombre,
      umbralAlerta: umbralAlerta,
      umbralPeligro: umbralPeligro,
      unidadMedida: unidadMedida,
  }
  const r = await registrarSensor(sensor);
  console.log(r);
  if (r.status === 200) return {
    status: 200,
    data: r.data
  }
  else return {
    status: r.status,
    formError: r.error
  }

}

export const action : ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const overlay = form.get("action") as string;
  
  switch (overlay) {
      case "agregarSensor":
        return await agregarSensor(form)
        
  }
  return {
      status: 500,
      formError:"Error"
  }
}
export const meta: MetaFunction = () => {
  return [
    { title: "Sensor del medio" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  let mdataSets: {[key:number]:dataSet[]} = {};

  return {
    time:new Date().toISOString(),
    data:await getData()
  }
}


export default function Index() {
  let loaderData = useLoaderData<typeof loader>();
  let dataTrigger =  useEventSource("/sse/datasets",{event:"dataSet"})??loaderData.time;
  const [dataSets, setDataSets] = useState<{[key:number]:dataSet[]}>({});
  const [labels, setLabels] = useState<{[key:number]:string[]}>({});
  const [data, setData] = useState(loaderData.data);
  const [newSensor, setNewSensor] = useState(false);
  const fetcher = useFetcher<typeof loader>();
  useEffect(()=>{
    fetcher.load("");
    if(fetcher.data){
      setData(fetcher.data.data)

      let mdata = fetcher.data.data;
      let mDatSets = dataSets;
      let mLabels = labels;
      // se le agrega la nueva medicion a cada sensor, si la lngitud de data es mayor a timelimit / 1000, se elimina el primero
      for (let sensor of mdata.sensores){
        if (mDatSets.hasOwnProperty(sensor.id)){
          if (mDatSets[sensor.id][0].data.length >= timeLimit / timegap){
            // quita el primer elemento de la lista
            mDatSets[sensor.id][0].data.shift();
            // quita el primer elemento de la lista de labels
            mLabels[sensor.id].shift();
          }
          if (mdata.labels[sensor.id] != mLabels[sensor.id][mLabels[sensor.id].length-1]){
          
            let mList = mDatSets[sensor.id][0].data;
            mList.push(sensor.valorActual);
            mDatSets[sensor.id][0].data = mList;
            mList = mLabels[sensor.id];
            mList.push(mdata.labels[sensor.id]);
            mLabels[sensor.id] = mList;
          }
        } else{
          mDatSets[sensor.id] = [{
            label: sensor.nombre,
            data: ["",sensor.valorActual]
          }];
          mLabels[sensor.id] = ["",mdata.labels[sensor.id]];
        
        }
      }
      
    }
  }
  ,[dataTrigger])



  useEffect(()=>{
    let mDataSets: {[key:number]:dataSet[]} = {};
    let mLabels: {[key:number]:string[]} = {};
    for (let sensor of data.sensores){
      mDataSets[sensor.id] = [{
        label: sensor.nombre,
        data: [0,sensor.valorActual]
      }];
      mLabels[sensor.id] = ["",data.labels[sensor.id]];
    }

    setDataSets(mDataSets);
    setLabels(mLabels);
  }
  ,[])

  return (
    <main>
      <Hero />
      <section>
        <div className="row wrap">
        {
            data.sensores.map( (sensor) =>
              <div className="card tirdpart sensor grow1" key={sensor.id}>
                <div className="row">
                  <p className="label-large">{sensor.nombre+" ("+sensor.valorActual+" "+sensor.unidadMedida+")"}</p>
                  {
                    !sensor.online && <ErrorDialog message="Desconectado"/> 
                  }
                  {
                    sensor.online && sensor.peligro && <ErrorDialog message="Peligro"/>
                  }
                  {
                    sensor.online && !sensor.peligro && sensor.alerta && <ErrorDialog message="Alerta"/>
                  }
                </div>
                {
                  dataSets.hasOwnProperty(sensor.id) && <GraficaLineas key={sensor.id} id={sensor.nombre} dataSets={dataSets[sensor.id]} labels={labels[sensor.id]} title={sensor.nombre+" ("+sensor.unidadMedida+")"} noLabels={true}/>
                }
              </div>
            )
            }
        </div>
      </section>
      <ExtendedFAB icon = "add" label="Agregar sensor" variant="tertiary" onClick={() => {setNewSensor(true)}}/>
      <AgregarSensorOverlay isDisplayed={newSensor} setIsDisplayed={setNewSensor}/>
    </main>
  );
}
