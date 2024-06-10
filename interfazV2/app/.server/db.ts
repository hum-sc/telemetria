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
    let medidas: { [key: number]: string; } = {};
    let labels: { [key: number]: string; } = {};
    for (const sensor of sensores) {
        const ultimaMedicion = await prisma.medicion.findFirst({
            where: {
                sensorId: sensor.id
            },
            orderBy: {
                timestamp: 'desc'
            }
        });
        

        medidas[sensor.id] = sensor.unidadMedida;
        //Sin am ni pm
        labels[sensor.id] = ultimaMedicion?.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit',second:'2-digit' }) || "Sin datos";
    }


    let data = {
        sensores,
        medidas,
        labels
    };

    return data;
}
