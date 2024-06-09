import { ReactNode, useEffect, useState } from "react";
import Button from "./Button";
import { Form } from "@remix-run/react";
import { useFetcher } from "react-router-dom";
import ErrorDialog from "./ErrorDialog";
/**
 * Toda accion que maneje el formulario creado por este componente debe retornar
 * {
 *  status:number
 *  data:any
 * }
 * o en caso de error
 * {
 * status:number
 * formError:string
 * }
 * @param props 
 * @returns 
 */
export default function Overlay(props: {
    children?: ReactNode | ReactNode[],
    onPrimary?: () => any,
    onSecundary?: () => any,
    isCancelable?: () => any
    primaryText?: string,
    secondaryText?: string,
    name: string,
    action: string,
    updateData?:(data: any) => void,
    onDanger?: () => any,
    dangerText?: string,
}) {
    const [errorMessage, setErrorMesage] = useState<string>("")
    const fetcher = useFetcher()
    const data:{ 
        status: number,
        data: any
    }|{
        status:number
        formError:string
    }| undefined = fetcher.data;

    useEffect(() => {
        if (data) {
            const status = data.status;
            if (status != 200) {
                setErrorMesage(data.formError)
            }else if(fetcher.state == "idle") {
                setErrorMesage("")
                props.updateData&& props.updateData(fetcher.data.data)
                props.onPrimary&&props.onPrimary();
            }
        }
    }, [fetcher.state]);
    
    return (
        <>
            <div className="overlayBackground"
                onClick={props.isCancelable}
            >

            </div>
            <fetcher.Form method="post" action={props.action} className="overlay">
                {errorMessage != "" ? <ErrorDialog message={errorMessage} /> : <></>}
                <input name="action" hidden value={props.name} readOnly></input>
                {props.children}
                <div className="row buttons">
                    {props.onDanger && <Button type={"submit"} variant={"filled"} className="error-container on-error-container-text" label={props.dangerText} />}
                    {props.onPrimary && <Button type={"submit"} variant={"filled"} className="primary" label={props.primaryText} />}
                    {props.onSecundary && <Button type={"button"} variant={"outlined"} className="secondary" label={props.secondaryText} onClick={props.onSecundary} />}
                </div>
            </fetcher.Form>
        </>
    );
}