import { ChangeEvent, useEffect, useState } from "react";
import TextField from "./TextField";

export type Option = {
    name:string,
    value:string
}

export default function InputMenu(props:{
    icon?:string, 
    label:string, 
    name:string, 
    variant:"outlined"|"filled", 
    maxLenght?:number, 
    suggestFunction?:(value:string)=>Promise<Option[]> , 
    initialSuggestions?:Option[], 
    selectOnly?:boolean, 
    onOptionClicked?: (val:string)=>void, 
    onEnterPressed?:()=>void, initialValue?:string 
}){
    var [suggestions, setSuggestions] = useState<Option[]>( props.initialSuggestions?props.initialSuggestions:[]);
    var [value,setValue] = useState<string>(props.initialValue?props.initialValue:"");
    const [active, setActive] = useState<number>(0);

    const onInputChange = async (event:any)=>{
        if (!props.selectOnly){
            setValue(event.target.value);
            if(props.suggestFunction){
                let suggest = await props.suggestFunction(event.target.value);
                setSuggestions(suggest);
            }
        }
        event.target.value == "" && setSuggestions([]);
    }

    const onEnterPressed = (val:string)=>{
        setValue(suggestions[active].value)
        setSuggestions([]);
        setTimeout(()=>{
            props.onEnterPressed&& props.onEnterPressed()
        }, 5)
    }

    const onArrowKeyPressed = (event:KeyboardEvent)=>{
        console.log(event.key);
        if((event.key == "ArrowDown" && !event.shiftKey )|| (event.key == "ArrowUp" && event.shiftKey)){
            if(active < suggestions.length-1) setActive(active+1);
            event.preventDefault();

        }else if(event.key == "ArrowUp" || (event.key == "ArrowDown" && event.shiftKey) ){
            event.preventDefault();
            if(active > 0) setActive(active-1);
        }
    }

    const onSuggestionSelected = ( val:string)=>{
        setValue(val);
        setSuggestions([]);
        setTimeout(()=>{
            props.onOptionClicked&& props.onOptionClicked(val)
        }, 5)
        
    }
    return(
        <div className="inputMenu">
            <TextField icon={props.icon} 
                label={props.label} 
                name={props.name} 
                type="search" 
                isValid={true} 
                variant="outlined" 
                maxLength={props.maxLenght} 
                onChange={onInputChange} 
                onEnterPressed={onEnterPressed} 
                onArrowKeyPressed={onArrowKeyPressed} 
                value={value} 
                onClick={()=>setSuggestions(props.initialSuggestions || [])}
            />
            {
                suggestions.length > 0 && <div className="column card suggest">
                    {
                        suggestions.map((option, index)=>{
                        return <option className={(index == suggestions.length-1 ? "last ":"")+(index == active && "active")} key={index} onClick={()=>onSuggestionSelected(option.value)} onMouseDown={(event)=>{
                            event.preventDefault();
                        }}>
                                {option.name}
                            </option>
                        })
                    }
                </div>
            }
        </div>
    );
}