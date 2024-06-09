import { PrismaClient } from "@prisma/client";
import { timeLimit } from "~/routes/_index";
const prisma = new PrismaClient();


export async function registrarSensor(data:{
    url:string,
    nombre:string,
    umbralAlerta:number | null,
    umbralPeligro:number | null,
    unidadMedida:string,
}){
    const exist = await prisma.sensor.count({
        where:{
            url:data.url
        }
    })
    if (exist) return{
        status: 500,
        error:"El sensor ya existe"
    }
    try {
        const sensor = await prisma.sensor.create({
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

export async function getData() {
    let sensores = await prisma.sensor.findMany();
    let mediciones: { [key: number]: number[]; } = {};
    let medidas: { [key: number]: string; } = {};
    let labels: { [key: number]: string[]; } = {};
    for (const sensor of sensores) {
        // mediciones de los ultimos 5 minutos agrupadas por 5 SEGUNDOS
        let medicion = await prisma.medicion.findMany({
            where: {
                sensorId: sensor.id,
                timestamp: {
                    gte: new Date(Date.now() - timeLimit)
                }
            },
            select: {
                valor: true,
                timestamp: true
            },
            orderBy: {
                timestamp: "asc"
            }
        });

        mediciones[sensor.id] = medicion.map(m => m.valor);
        medidas[sensor.id] = sensor.unidadMedida;
        labels[sensor.id] = medicion.map(m => m.timestamp.toLocaleTimeString());
    }


    let data = {
        sensores,
        mediciones,
        medidas,
        labels
    };

    return data;
}
