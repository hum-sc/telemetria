import { Medicion, PrismaClient } from "@prisma/client";
import { json } from "@remix-run/react";
import axios from "axios";
const db = new PrismaClient();

export async function registrarSensor(data:{
    url:string,
    nombre:string,
    umbralAlerta:number | null,
    umbralPeligro:number | null,
    unidadMedida:string,
}){
    const exist = await db.sensor.count({
        where:{
            url:data.url
        }
    })
    if (exist) return{
        status: 500,
        error:"El sensor ya existe"
    }
    try {
        const sensor = await db.sensor.create({
            data:{
                url:data.url,
                nombre:data.nombre,
                umbralAlerta:data.umbralAlerta ? data.umbralAlerta : 0,
                umbralPeligro:data.umbralPeligro ? data.umbralPeligro : 0,
                unidadMedida:data.unidadMedida,
            }
        });
        return {
            status:200,
            data:sensor,
        }
    }
    catch(e){
        return {
            status:500,
            error:"Ocurrió algun error",
        }
    }

}

export async function obtenerSensores(){
    const sensores = await db.sensor.findMany();
    return sensores;
}

async function getMedicion(url:string){
    console.log(url)
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url:"http://"+url,
        headers: { }
    };

    try{
        const request = await axios.request(config)
        if (request.status !== 200) {
            return {
                status: request.status,
                error: "Error al obtener la medicion"
            }
        
        };
        //request.data
        console.log(request.data);
        return {
            status: 200,
            data: request.data
        }
    }
    catch(e){
        console.log("Error al obtener la medicion");
        return {
            status: 500,
            error: "Error al obtener la medicion"
        }
    }

    
}

export async function registrarMedicion(data:{
    sensorId:number,
    
}){
    const exist = await db.sensor.count({
        where:{
            id:data.sensorId
        }
    })

    if (!exist) return{
        status: 500,
        error:"El sensor no existe"
    }

    try {
        const medicion = await db.medicion.create({
            data:{
                sensorId:data.sensorId,
                valor:0,
            }
        });
        return {
            status:200,
            data:medicion,
        }
    }
    catch(e){
        return {
            status:500,
            error:"Ocurrió algun error",
        }
    }


}

// Leer mediciones y registrar mediciones
export async function monitorea() {
    console.log("Monitoreando");
    // sensores es el id y la url
    const sensores = await db.sensor.findMany({
        select: {
            id: true,
            url: true
        }
    })
    // por cada sensor ejecuta getMedicion y los crea en la base de datos
    for (const sensor of sensores) {
        const medicion = await getMedicion(sensor.url);

        if (medicion.status !== 200){
            // Set sensor.online = false
            await db.sensor.update({
                where:{
                    id:sensor.id
                },
                data:{
                    online:false
                }
            })
            continue;
        }

        // Set sensor.online = true
        await db.sensor.update({
            where:{
                id:sensor.id
            },
            data:{
                online:true
            }
        })

        try{
            // Crea la medicion en la base de datos
            await db.medicion.create({
                data:{
                    valor:medicion.data.valor,
                    sensorId:sensor.id
                }
            })

            // Actualiza las unidades de medida
            await db.sensor.update({
                where:{
                    id:sensor.id
                },
                data:{
                    unidadMedida:medicion.data.unidades
                }
            })
        } catch(e){
            console.log("Error al registrar medicion");
        }
    } 
}

export async function obtenerMediciones(sensorId:number){
    const mediciones = await db.medicion.findMany({
        where:{
            sensorId:sensorId
        }
    })
    return mediciones;
}

export async function obtenerMedicionesUltimoMinuto(sensorId:number){
    const mediciones = await db.medicion.findMany({
        where:{
            sensorId:sensorId
        },
        orderBy:{
            timestamp:"desc"
        },
        take:60
    })
    //console.log(mediciones);
    return mediciones;
}

export async function obtenerDatosUltimoMinuto(){
    const sensores = await db.sensor.findMany();
    const mediciones:{[key:number]:number[]} = {};
    const medidas:{[key:number]:string} = {};
    const labels:{[key:number]:string[]} = {};
    for (const sensor of sensores){
        let medicionesSensor = await obtenerMedicionesUltimoMinuto(sensor.id);
        // invertimos mediciones
        medicionesSensor = medicionesSensor.reverse();
        mediciones[sensor.id] = medicionesSensor.map((medicion) => medicion.valor);
        medidas[sensor.id] = sensor.unidadMedida;
        labels[sensor.id] = medicionesSensor.map((medicion) => medicion.timestamp.toLocaleTimeString());
    }



    return {
        sensores,
        mediciones,
        medidas,
        labels
    }
}

