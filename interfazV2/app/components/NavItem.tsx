import { Link, NavLink } from "@remix-run/react";
import Icon from "./Icon";
import { ReactNode } from "react";

export default function NavItem(props:{name:string, link:string, icon:string, end:boolean|undefined}){
    return(
        <>
        <NavLink prefetch="render" to = {props.link} className={({isActive, isPending})=>"navItem "+(isPending?"selected":isActive?"selected":"")} end={props.end}>
            

            {({isActive, isPending}) =>(
                <>
                    <Icon icon={props.icon} type={isActive?"filled":"outlined"}/>
                    
                    <p className="label-large">
                        {props.name}
                    </p>
                </>
            )}
            
        </NavLink>
        </> 
    );
}
