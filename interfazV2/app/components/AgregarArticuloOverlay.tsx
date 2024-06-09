import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import InputMenu, { Option } from "~/components/InputMenu";
import Overlay from "~/components/Overlay";
import TextField from "~/components/TextField";
import { Ciudad } from "~/types/Ciudad";
import { Articulo } from "~/types/Articulo";
import { suggestCiudad } from "~/utils/ciudad.api";
import { registrarEmpleado } from "~/utils/empleados.server";
import { NuevoArticuloOverlay } from "./NuevoArticuloOverlay";

export const agregarEmpleado = async (form: FormData, request: Request) => {

    const nombre = form.get("nombre") as string;
    const lugar = form.get("lugar") as string;

    let id: string | number = form.get("id") as string;
    id = parseInt(id);

    let costo: string | number = form.get("costo") as string;
    costo = parseInt(costo);

    let cantidad: string | number = form.get("cantidad") as string;
    cantidad = parseInt(cantidad);

    // Si todos los campos tienen valor continua, si no regresa un error
    if (!nombre || !lugar || !id || !costo || !cantidad) {
        return {
            status: 400,
            formError: "Todos los campos son obligatorios"
        }
    }

    const articulo: Articulo = {

        nombre: nombre,
        id: id,
        costo: costo,
        cantidad: cantidad,
        lugar: lugar
    }

    const r = await registrarEmpleado(request, articulo)

    if (r.status == 200) {
        return {
            status: 200,
            data: r.data as {
                id: number
            }
        }
    } else {
        return {
            status: r.status,
            formError: r.error
        }
    }


}




export function AgregarArticuloOverlay(props: {
    isDisplayed: boolean;
    setDisplayed: (val: boolean) => void,
    token: string,
}
) {

    const [rfc, setRfc] = useState("");
    const [newContrato, setNewContrato] = useState(false);

    const fetcher = useFetcher();

    const onRfcChange = (e: any) => {
        let rfcU: string = e.target.value;
        rfcU = rfcU.toUpperCase();
        setRfc(rfcU);
    };

    const onEmpleadoAgregado = () => {
        props.setDisplayed(false);
        setNewContrato(true);
    }



    const [id, setId] = useState<number>();
    const [nombre, setNombre] = useState<string>("")

    const updateData = (data: {
        id: number,
        nombre: string
    }) => {
        console.log(data)
        setId(data.id);
        setNombre(data.nombre);
    }


    const suggestCiudades = async (val: string) => {
        let sCiudad: Ciudad[] = [];
        if (val != "") {
            sCiudad = await suggestCiudad(props.token, val);

            return sCiudad.map(c => {
                return {
                    name: c.nombre,
                    value: c.id
                } as Option;
            });
        }
        return [];

    };


    return (<>
        {
            props.isDisplayed && <Overlay
                isCancelable={() => props.setDisplayed(false)}
                onPrimary={onEmpleadoAgregado}
                onSecundary={() => props.setDisplayed(false)}
                primaryText="Registrar"
                secondaryText="Cancelar"
                name={"agregarEmpleado"}
                action="?index"
                updateData={updateData}
            >
                <h2 className="display-medium on-surface-text">Agregar Artículo</h2>
                <TextField
                    label={"Nombre"}
                    name={"nombre"}
                    type={"text"}
                    variant={"outlined"}
                />
                <div className="row">
                    <TextField
                        label={"Telefono"}
                        name={"telefono"}
                        type={"tel"}
                        variant={"outlined"}
                        pattern="[0-9]{10}"
                        maxLength={10}
                    />
                    <TextField
                        value={rfc}
                        label={"RFC"}
                        name={"rfc"}
                        type={"text"}
                        variant={"outlined"}
                        minLenght={12}
                        maxLength={13}
                        autoCapitalize="words"
                        onChange={onRfcChange}
                    />
                    <TextField
                        label={"NSS"}
                        name={"nss"}
                        type={"number"}
                        variant={"outlined"}
                        pattern="[0-9]{11}"
                        max={99999999999}
                    />
                </div>
                
            </Overlay>
        }
        {
            <NuevoArticuloOverlay token={props.token} setNewContrato={setNewContrato} id={id} nombre={nombre} isDisplayed={newContrato} />
        }
    </>
    );
}

