import { ChangeEvent, useRef, useState } from "react";
import InputMenu from "~/components/InputMenu";
import Overlay from "~/components/Overlay";
import TextField from "~/components/TextField";
import InformacionGeneral from "./InformacionGeneral";
import { Contrato } from "~/types/Contrato";
import { Option } from "~/components/InputMenu";
import { nuevoContrato } from "~/utils/empleados.server";
import { LugarOption } from "~/types/Lugar";
import { suggestLugar } from "~/utils/lugar.api";

export const registrarNuevoContrato = async (form:FormData, request:Request) => {
    const empleado = form.get("empleado") as string;
    const puesto = form.get("puesto") as string;
    let lugar: number|string = form.get("lugar") as string;
    lugar = parseInt(lugar);
    let salario: number|string = form.get("salario") as string;
    salario = parseFloat(salario);
    const fechaInicio: string = form.get("inicio") as string;
    const fechaFin: string = form.get("fin") as string;
    const vacaciones = form.get("vacaciones") as string;
    const horas = form.get("horas") as string;

    // si los campos estan vacios regresar un error
    if (!empleado || !puesto || !lugar || !salario || !fechaInicio || !vacaciones || !horas) {
        return {
            status: 400,
            formError: "Faltan campos por llenar"
        }
    }
    const contrato: Contrato ={
        idEmpleado: parseInt(empleado),
        idLugar: lugar,
        fechaInicio: new Date(fechaInicio),
        puesto: puesto,
        salario: salario,
        diasVacaciones:parseInt(vacaciones),
        horasDiarias: parseInt(horas)
    }

    if (fechaFin) contrato.fechaFin = new Date(fechaFin);

    const r = await nuevoContrato(request, contrato);

    if (r.status == 200) {
        return {
            status: 200,
            data:r.data
        }
    }
    return {
        status: r.status,
        formError: r.error
    }
}

export function NuevoContratoOverlay(props: {
    setNewContrato: (val: boolean) => void;
    isDisplayed: boolean;
    id?: number | undefined;
    nombre?: string;
    token: string;
}) {
    const [startDate, setStartDate] = useState<Date>(new Date());

    const updateStartDate = (e: ChangeEvent) => {
        setStartDate(new Date(e.currentTarget.value));
    };

    const ref = useRef<HTMLInputElement>(null);

    const puestos:Option[]=[
        {
            name:"Recursos Humanos",
            value:"Recursos_Humanos"
        },
        {
            name: "Ventas",
            value: "Ventas"
        },
        {
            name: "Inventario",
            value: "Inventario"
        },
        {
            name: "Finanzas",
            value: "Finanzas"
        },
        {
            name: "Administrador",
            value: "Admin"
        }   
    ]

    const suggestLugarOptions = async (input:string) => {
        let lugares:LugarOption[] = [];
    
        if (input != ""){
            lugares = await suggestLugar(props.token, input);
            console.log(lugares)
            return (lugares.map((lugar) => {
                return {
                    name: lugar.nombre,
                    value: lugar.id.toString()
                } as Option
            }));
        }
        return [];
    }
    return <>
        {props.isDisplayed &&
            <Overlay primaryText={"Crear"} name={"nuevoContrato"} action={"?index"} onPrimary={() => props.setNewContrato(false)}>
                <div className="column">
                    <h2 className="display-medium on-surface-text">Nuevo contrato</h2>
                    {(props.id && props.nombre) ?
                        <div className="row">
                            <InformacionGeneral label={"Id del Empleado"} content={props.id.toString()} variant={"default"} type={"filled"} />
                            <InformacionGeneral label={"Nombre del empleado"} content={props.nombre} variant={"default"} type={"filled"} />
                            <input name={"empleado"} value={props.id.toString()} type={"text"} readOnly hidden></input>
                        </div>:
                        <InputMenu label={"Empleado"} name={"empleado"} variant={"outlined"} />
                    }  
                    <div className="row">
                        <InputMenu label={"Puesto*"} name={"puesto"} variant={"filled"} initialSuggestions={puestos} selectOnly />
                        <InputMenu label={"Lugar*"} name={"lugar"} variant={"filled"} suggestFunction={suggestLugarOptions}/>
                        <TextField label={"Salario*"} name={"salario"} type={"number"} variant={"outlined"} min={0} max={100000000}/>
                    </div>
                    <div className="row">
                        <TextField label={"Dias de vacaciones al año*"} name={"vacaciones"} type={"number"} variant={"outlined"} max={365} min={6} />
                        <TextField label={"Horas diarias"} name="horas" type="number" variant="outlined" max={24} min={0}/>
                    </div>
                    <div className="row">
                        <TextField label={"Fecha de inicio*"}
                            name={"inicio"}
                            type={"date"}
                            variant={"outlined"}
                            min={new Date(Date.now()).toISOString().split("T")[0]}
                            onChange={updateStartDate} />
                        <TextField label={"Fecha de finalizacion"}
                            name={"fin"}
                            type={"date"}
                            variant={"outlined"}
                            min={startDate.toISOString().split("T")[0]}
                        />
                    </div>
                </div>
            </Overlay>
        }
    </>;
}
