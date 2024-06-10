import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express, { request } from "express";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { send } from "vite";
const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);




// monitorea

const prisma = new PrismaClient();

async function getMedicion(url){
  console.log(url)
  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url:"http://"+url,
      headers: { }
  };
  let req
  try{
      req = await axios.request(config)
      console.log(req.status);
      if (req.status !== 200) {
          return {
              status: req.status,
              error: "Error al obtener la medicion"
          }
      
      };
      return {
          status: 200,
          data: req.data
      }
  }
  catch(e){
      console.log(req);
      console.log("Error Error al obtener la medicion");
      return {
          status: 500,
          error: "Error al obtener la medicion"
      }
  }
}

async function sendAction(url, action){
  // Emite un sonido

  let data = JSON.stringify({
      "accion": action
  });
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url:"http://"+url+"/accion",
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  try{
    const r = await axios.request(config)
    r.status === 200 ? console.log("Accion enviada") : console.log("Error al enviar la accion");
    
  } catch(e){
    console.log("Error al enviar la accion");
  }


}

async function monitorea(){

  
  try{
    const sensores = await prisma.sensor.findMany();
    for (let sensor of sensores){
      let isNotified = sensor.alerta || sensor.peligro;
        console.log("Monitoreando sensor: ", sensor.id);
        console.log("Notificado ", isNotified);
        try{
          
        const medicion = await getMedicion(sensor.url);

        const alerta = medicion.data.valor >= sensor.umbralAlerta && !sensor.peligro && medicion.data.valor < sensor.umbralPeligro;
        const peligro = medicion.data.valor >= sensor.umbralAlerta;

        console.log("Valor: ", medicion.data.valor);
        console.log("Alerta: ", alerta);
        console.log("Peligro: ", peligro);
        if (medicion.status === 200){
          let sensor2 =  await prisma.sensor.update({
            where: {
                id: sensor.id
            },
            data: {
                online: true,
                unidadMedida: medicion.data.unidades,
                valorActual: medicion.data.valor,
                alerta:alerta,
                peligro: peligro,
            }
          });
          // el timestamp esta en segundos
          let timestamp = new Date(medicion.data.timestamp * 1000);
          console.log("Timestamp: ", timestamp.toLocaleString());
          await prisma.medicion.create({
            data: {
              valor: medicion.data.valor,
              sensorId: sensor.id,
              // El timestamp generado por el sensor
              
              timestamp: timestamp
            }
          });
          console.log("Medicion: ", medicion.data.valor, "Agregada");
          if(peligro && !isNotified){
            isNotified = true;
            sendAction(sensor.url, "peligro");
          }
          if(alerta && !isNotified){
            isNotified = true;
            sendAction(sensor.url, "alerta");
          }
          console.log("Sensor: ", sensor.id, " monitoreado");
        } else{
          await prisma.sensor.update({
              where: {
                  id: sensor.id
              },
              data: {
                  online: false
              }
          });

          await prisma.medicion.create({
            data: {
              valor: sensor.valorActual,
              sensorId: sensor.id
            }
          });
        }
      } catch(e){
        console.log("Error al monitorear el sensor");
        await prisma.sensor.update({
            where: {
                id: sensor.id
            },
            data: {
                online: false
            }
        });

        await prisma.medicion.create({
          data: {
            valor: sensor.valorActual,
            sensorId: sensor.id
          }
        });
      }
    }
    
    
  }
  catch(e){
    console.log(e)
    console.log("Error al obtener los sensores");
  }
}



const interval = setInterval(monitorea, 1000);