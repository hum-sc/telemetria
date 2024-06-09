import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import InputMenu, { Option } from "~/components/InputMenu";
import Overlay from "~/components/Overlay";
import TextField from "~/components/TextField";
import { Ciudad } from "~/types/Ciudad";
import { Empleado } from "~/types/Empleado";
import { suggestCiudad } from "~/utils/ciudad.api";
import { registrarEmpleado } from "~/utils/empleados.server";
import { NuevoContratoOverlay } from "./NuevoContratoOverlay";

export const agregarEmpleado = async (form: FormData, request: Request) => {

    const nombre = form.get("nombre") as string;
    const rfc = form.get("rfc") as string;
    const correo = form.get("correo") as string;
    const contraseña = form.get("contraseña") as string;
    const ciudad = form.get("ciudad") as string;
    const calle = form.get("calle") as string;

    let telefono: string | number = form.get("telefono") as string;
    telefono = parseInt(telefono);

    let nss: string | number = form.get("nss") as string;
    nss = parseInt(nss);

    let fechaNacimiento: string | Date = form.get("fechaNacimiento") as string;
    fechaNacimiento = new Date(fechaNacimiento);

    let nexterno: string | number = form.get("nexterno") as string;
    nexterno = parseInt(nexterno);

    let ninterno: string | number = form.get("ninterno") as string;
    ninterno = parseInt(ninterno);

    let cp: string | number = form.get("cp") as string;
    cp = parseInt(cp);

    // Si todos los campos tienen valor continua, si no regresa un error
    if (!nombre || !telefono || !rfc || !nss || !correo || !contraseña || !fechaNacimiento || !ciudad || !calle || !nexterno || !ninterno || !cp) {
        return {
            status: 400,
            formError: "Todos los campos son obligatorios"
        }
    }

    const empleado: Empleado = {

        nombre: nombre,
        telefono: telefono,
        correo: correo,
        codigoPostal: cp,
        idCiudad: ciudad,
        calle: calle,
        numeroInterno: ninterno,
        numeroExterno: nexterno,
        nss: nss,
        rfc: rfc,
        fechaDeNacimiento: fechaNacimiento,
        fechaDeIngreso: new Date(Date.now()),
        indiceProductividad: 1,
        password: contraseña
    }

    const r = await registrarEmpleado(request, empleado)

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




export function AgregarEmpleadoOverlay(props: {
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
                <h2 className="display-medium on-surface-text">Agregar empleado</h2>
                <TextField
                    label={"Nombre completo"}
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
                <div className="row">
                    <TextField
                        label={"Correo electronico"}
                        name={"correo"} type={"email"}
                        variant={"outlined"}
                        autoComplete="none"
                    />
                    <TextField
                        label={"Contraseña"}
                        name={"contraseña"}
                        type={"password"}
                        variant={"outlined"}
                        autoComplete="none"
                    />
                    <TextField
                        label={"Fecha de nacimiento"}
                        name={"nacim"}
                        type={"date"}
                        variant={"outlined"}
                    />
                </div>
                <div className="row">
                    <InputMenu
                        label={"Ciudad"}
                        name={"ciudad"}
                        variant={"outlined"}
                        suggestFunction={suggestCiudades}
                    />
                    <TextField
                        label={"Calle"}
                        name={"calle"}
                        type={"text"}
                        variant={"outlined"}
                    />
                </div>
                <div className="row">
                    <TextField
                        label={"No. Externo"}
                        name={"nexterno"}
                        type={"number"}
                        variant={"outlined"}
                        min={0}
                    />
                    <TextField
                        label={"No. Interno"}
                        name={"ninterno"}
                        type={"number"}
                        variant={"outlined"}
                        min={0}
                    />
                    <TextField
                        label={"Código Postal"}
                        name={"cp"}
                        type={"tel"}
                        variant={"outlined"}
                        pattern="[0-9]{5}"
                        maxLength={5}
                    />
                </div>
            </Overlay>
        }
        {
            <NuevoContratoOverlay token={props.token} setNewContrato={setNewContrato} id={id} nombre={nombre} isDisplayed={newContrato} />
        }
    </>
    );
}

