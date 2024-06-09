import { LinksFunction } from "@remix-run/node"



export default function Icon(props: {icon:string, type: "outlined"|"filled"|undefined} ){
    return(
        <span 
        className="material-symbols-outlined"
        style={ props.type === "filled" ? {fontVariationSettings:"'FILL' 1"} : {fontVariationSettings:"'FILL' 0"}}
        >{props.icon}</span>
        
    )

}