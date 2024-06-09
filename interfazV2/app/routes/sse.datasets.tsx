import { eventStream } from "remix-utils/sse/server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { timeLimit, timegap } from "./_index";


export async function loader({request}:LoaderFunctionArgs){
    return eventStream(request.signal, function setup(send){
        let timer = setInterval(async ()=>{
            //console.log(dataSet);

            send({
                event:"dataSet",
                data: new Date().toISOString(),
            })
        },timegap)
       return function clear(){
              clearInterval(timer);
       }
    });

}

