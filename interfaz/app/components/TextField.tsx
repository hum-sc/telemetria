import { ChangeEventHandler, InputHTMLAttributes, useRef, useState } from "react";
import Icon from "./Icon";
import { pattern } from "isbot";


export default function TextField(props: {
    icon?:string, 
    label: string, 
    name: string, 
    type: string, 
    variant: "outlined", 
    onChange?: ChangeEventHandler<HTMLInputElement>, 
    isValid?: boolean, 
    min?:string|number, 
    max?:string|number, 
    fileAccept?:string, 
    maxLength?:number, 
    minLenght?:number, 
    onEnterPressed?:(value:string)=>void, value?:string, 
    onArrowKeyPressed?:(event:any)=>void, 
    onClick?:()=>void,
    autoComplete?:string,
    pattern?:string
    autoCapitalize?:string
}) {
    const [isValid, setValid] = useState( props.isValid===undefined?true:props.isValid)
    const descRef = useRef<HTMLInputElement>(null);

    const onEnterPressed = (event:any)=>{
        if(event.key == "Enter"){
            if(props.onEnterPressed){
                props.onEnterPressed(event);
            }
            descRef.current?.type=="search" && descRef.current?.blur();
        }
        if(event.key == "ArrowDown" || event.key == "ArrowUp"){
            props.onArrowKeyPressed && props.onArrowKeyPressed(event);
        }
        
    }
    return (
        <div className={"textField "+props.variant+" "+(isValid?"":"error")} onClick={props.onClick}>
            
            {
                (props.icon && props.type != "date" )&& <Icon 
                    icon={props.icon} 
                    type={"outlined"}/>
            
            }
            <label className="body-small" 
                htmlFor={props.name}>
                    {props.label}
            </label>
            
            <input  
                ref={descRef}
                id={props.name} 
                name={props.name} 
                type={props.type} 
                placeholder=" " 
                className="body-large" 
                onChange={props.onChange} 
                min={props.min} 
                max={props.max} 
                maxLength={props.maxLength} 
                minLength={props.minLenght} 
                onKeyDown={onEnterPressed} 
                value={props.value}
                autoComplete={props.autoComplete? props.autoComplete:"off"}
                pattern={props.pattern}
            />
        </div>
    );
}