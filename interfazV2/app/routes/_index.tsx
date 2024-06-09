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

export let timegap = 1000;
export let timeLimit = 5*60*1000;
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

export const action : ActionFunction = async ({ request }: ActionFunctionArgs) => {
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
  let time = useEventSource("/sse/time",{event:"time"})??loaderData.time;
  let dataTrigger =  useEventSource("/sse/datasets",{event:"dataSet"})??loaderData.time;
  const [dataSets, setDataSets] = useState<{[key:number]:dataSet[]}>({});
  const [data, setData] = useState(loaderData.data);
  const [newSensor, setNewSensor] = useState(false);
  const fetcher = useFetcher<typeof loader>();
  useEffect(()=>{
    fetcher.load("");
    if(fetcher.data){
      setData(fetcher.data.data)
      let mdata = fetcher.data.data;
      let mdataSets: {[key: number]: dataSet[]} = {};
      for (let sensor of mdata.sensores){
        mdataSets[sensor.id] = [{
          label: sensor.nombre,
          data: mdata.mediciones[sensor.id]
        }];
      }
      console.log(mdataSets);
      setDataSets(mdataSets);
      
    }
  }
  ,[dataTrigger])

  useEffect(() => {
    let mdataSets: {[key: number]: dataSet[]} = {};
    for (let sensor of data.sensores){
      mdataSets[sensor.id] = [{
        label: sensor.nombre,
        data: data.mediciones[sensor.id]
      }];
    }
    console.log(mdataSets);
    setDataSets(mdataSets);
  }, [data])
  

  return (
    <main>
      <Hero />
      <div className="row">
      {
          data.sensores.map( (sensor) =>
            <div className="card tirdpart sensor" key={sensor.id}>
              <div className="row">
                <h3>{sensor.nombre+" ("+sensor.valorActual+" "+sensor.unidadMedida+")"}</h3>
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
                dataSets.hasOwnProperty(sensor.id) && <GraficaLineas key={sensor.id} id={sensor.id} dataSets={dataSets[sensor.id]} labels={data.labels[sensor.id]} title={sensor.nombre+" ("+sensor.unidadMedida+")"}/>
              }
            </div>
          )
          }
      </div>
      <ExtendedFAB icon = "add" label="Agregar sensor" variant="tertiary" onClick={() => {setNewSensor(true)}}/>
      <AgregarSensorOverlay isDisplayed={newSensor} setIsDisplayed={setNewSensor}/>
    </main>
  );
}
