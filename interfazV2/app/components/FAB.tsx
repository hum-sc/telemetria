import Icon from "./Icon";

export default function FAB(props:{icon:string, variant:"primary"|"secondary"|"tertiary"|"surface", onClick:()=>void}){
    return(
        <button className={"fab "+props.variant} onClick={props.onClick}>
            <Icon icon={props.icon} type="outlined"/>
            <div className={'state-layer on-primary'}/>
        </button>
    );
}