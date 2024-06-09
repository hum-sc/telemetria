import { LinksFunction, redirect } from "@remix-run/node";
import InformacionGeneral from "./InformacionGeneral";
import InformacionCantidad from "./InformacionCantidad";
import { Link, useNavigate } from "@remix-run/react";





export default function InformacionLugarBuscarRH(props:{
    id: string,
    nombre: string,
    direccion: string,
    empleados: number,
    productividad: number,
    tipo: string,
    encargado: string,
}) {
    const redirect = useNavigate()
    return (
        <Link className="infoLugar" to={`./${props.id}`} prefetch="intent">
            <h3 className="headline-small on-surface-text">{props.nombre}</h3>
            <InformacionGeneral label={"Dirección"} content={props.direccion} variant={"line"} type={"filled"} />
            <div className="row wrap fit">
                <InformacionCantidad title={"Empleados"} cantidad={props.empleados} variant={"pequeño"} type={"filled"} />
                <InformacionCantidad title={"Productividad"} cantidad={props.productividad} variant={"pequeño"} type={"filled"} />
                <InformacionGeneral label={"Tipo Tienda"} content={props.tipo} variant={"default"} type={"filled"} />
            </div>
            <InformacionGeneral label={"Encargado"} content={props.encargado} variant={"line"} type={"filled"} />
        </Link>
    );

}