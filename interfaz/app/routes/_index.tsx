import type { ActionFunction, LoaderFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, Outlet, useFetcher, useLoaderData, useMatches } from "@remix-run/react";
import { AgregarSensorOverlay } from "~/components/AgregarSensorOverlay";
import ExtendedFAB from "~/components/ExtendedFAB";
import Hero from "~/components/Hero";
import { useEffect, useState } from "react";
import { ActionFunctionArgs } from "@remix-run/node";
import { monitorea, obtenerDatosUltimoMinuto, registrarSensor } from "~/.server/db";
import { l } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { Medicion, Sensor } from "@prisma/client";
import GraficaLineas, { dataSet } from "~/components/Linea";
import ErrorDialog from "~/components/ErrorDialog";

export const meta: MetaFunction = () => {
  return [
    { title: "Sensor del medio" },
    { name: "description", content: "Monitoreo de sensores" },
  ];
};

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
// Cada 5 segundos se actualizan las mediciones
export const loader:LoaderFunction = async (args: LoaderFunctionArgs) => {
  monitorea()
  return await obtenerDatosUltimoMinuto();
}

export default function Index() {
  const loaderData = useLoaderData();
  const [newSensor, setNewSensor] = useState<boolean>(false);
  const [data, setData] = useState(loaderData);
  const fetcher = useFetcher();

  const [dataSets, setDataSets] = useState<{[key: number]: dataSet[]}>({});


  useEffect(() => {
    let interval = setInterval(() => {
      fetcher.load('');
    }, 500);
    return () => clearInterval(interval);
  },[])

  useEffect(() => {
    if(fetcher.data){
      setData(fetcher.data)
    }
  }, [fetcher.data])

  useEffect(() => {
    let mdataSets: {[key: number]: dataSet[]} = {};
    for (let sensor of data.sensores){
      mdataSets[sensor.id] = [{
        label: sensor.id,
        data: data.mediciones[sensor.id]
      }];
    }

    console.log(mdataSets)

    setDataSets(mdataSets);
  }, [data])

  
  
  return (
    <main>
      <Hero/>
      <div className="row">
        {
          data.sensores.map( (sensor) =>
            <div className="card tirdpart" key={sensor.id}>
              <div className="row">
                <h3>{sensor.nombre+" ("+sensor.unidadMedida+")"}</h3>
                {
                  !sensor.online && <ErrorDialog message="Sensor desconectado"/> 
                }
                {
                  sensor.online && <p>Online</p>
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
      <Outlet/>
    </main>
  );
}
