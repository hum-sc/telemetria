import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import InputMenu, { Option } from "~/components/InputMenu";
import Overlay from "~/components/Overlay";
import TextField from "./TextField";

export function AgregarSensorOverlay(props: {
    isDisplayed: boolean,
    setIsDisplayed: (isDisplayed: boolean) => void
}){
    return (
        <>
    
            {
                props.isDisplayed && <Overlay
                isCancelable={() => props.setIsDisplayed(false)}
                onPrimary={() => props.setIsDisplayed(false)}
                onSecundary={() => props.setIsDisplayed(false)}
                primaryText="Agregar"
                secondaryText="Cancelar"
                name="agregarSensor"
                action="?index"
                >
                    <TextField
                        label = {"URL"}
                        name = {"url"}
                        type = {"text"}
                        variant = {"outlined"}
                        // Patern of an url to validate the input
                        />
                    <TextField
                        label = {"Nombre"}
                        name = {"nombre"}
                        type = {"text"}
                        variant = {"outlined"}
                        />
                    <div className="row">
                        <TextField
                            label = {"Umbral de alerta"}
                            name = {"umbralAlerta"}
                            type = {"number"}
                            variant = {"outlined"}
                            />
                        <TextField
                            label = {"Umbral de peligro"}
                            name = {"umbralPeligro"}
                            type = {"number"}
                            variant = {"outlined"}
                            />
                        <TextField
                            label = {"Unidad de medida"}
                            name = {"unidadMedida"}
                            type = {"text"}
                            variant = {"outlined"}
                            />
                    </div>
                </Overlay>
                
            }
        </>
    )
}