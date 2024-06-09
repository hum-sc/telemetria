
import { LegacyRef } from 'react';
import Icon from './Icon';
/**
 * Renderiza un boton, tiene distintos tipos
 * @params className: string, icon: string, disabled: boolean, color: string, label: string, type: "button" | "submit" | "reset" , variant:"filled" | "outlined" | "text" | "elevated" | "text" | "tonal", onClick:()=>void, ref:LegacyRef<HTMLButtonElement>   
 * @returns 
 */
export default function Button(props: { className?:string,icon?:string,disabled?:boolean, color?: string, label?: string, type: "button" | "submit" | "reset" , variant:"filled" | "outlined" | "text" | "elevated" | "text" | "tonal", onClick?:()=>void, ref?:LegacyRef<HTMLButtonElement>}) {
    
    return (
        <>
            <button 
            ref={props.ref}            
            type={props.type} 
            style={!props.icon ? {padding:"10px 24px"}:{}} 
            className={props.variant+" "+props.className+" "+props.color+" button "+(!props.label &&"no-label")} 
            disabled={props.disabled} 
            onClick={props.onClick}
            >
                {props.icon && <Icon icon={props.icon} type="outlined"/>}
                {props.label&&<p className='label-large'>{props.label}</p>}
                <div className={'state-layer on-primary'}/>
            </button>
        </>
    );
}