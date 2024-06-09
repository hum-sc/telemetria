import Icon from "./Icon";

export default function ExtendedFAB(props:{onClick:()=>void, icon:string, label:string, variant:"primary"|"secondary"|"tertiary"|"surface"}){
    return(
        <button className={"extended fab "+props.variant} onClick={props.onClick}>
            <Icon icon={props.icon} type="outlined"/>
            <label>{props.label}</label>
            <div className={'state-layer on-primary'}/>
        </button>
    );
}