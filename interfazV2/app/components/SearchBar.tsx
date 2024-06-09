import { Form, useSubmit } from "@remix-run/react";
import Button from "./Button";
import InputMenu from "./InputMenu";
import { Option } from "./InputMenu";
import { LegacyRef, useRef } from "react";

export default function SearchBar(props:{label:string, collapsed?:boolean, searchSuggestFunction?:(value:string)=>Option[], maxLenght?:number, value?:string}){
    
    const formRef = useRef<HTMLFormElement>(null)
    const submit = useSubmit();
    return(
        <Form reloadDocument={false}
            name="search" 
            method="get" 
            className="searchBar" 
            onChange={(e)=>{!props.searchSuggestFunction && submit(e.currentTarget)}} 
            ref={formRef}>
            <InputMenu 
                label={props.label} 
                name={"searchValue"} 
                variant={"outlined"} 
                suggestFunction={props.searchSuggestFunction}
                maxLenght={props.maxLenght}
                onEnterPressed={()=>formRef.current?.submit()}
                onOptionClicked={()=>formRef.current?.submit()}
                initialValue={props.value}
            />
            {
                props.collapsed ? <Button type="submit" 
                    
                    variant="filled" 
                    icon="search" 
                    className="primary" 
                />
                :<Button 
                    
                    label={"Buscar"} 
                    type={"submit"} 
                    variant={"filled"} 
                    className="primary" 
                    icon="search"
                />
            }
        </Form> 
        
        
    );

}