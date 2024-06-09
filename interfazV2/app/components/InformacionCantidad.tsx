export default function (props:{variant:"pequeño"|"mediano"|"grande", type:"filled"|"transparent", cantidad:number, title:string, id?:string, className?:string}){
    const pClass = props.variant=="pequeño"?"title-small":props.variant == "mediano"?"title-large":"display-large";
    const labelClass = props.variant=="pequeño"?"label-small":props.variant=="mediano"?"label-medium":"label-large";
    return(
        <div className={"informacion cantidad "+props.type+" "+props.variant+" "+props.className} id={props.id}>
            <p className={pClass}>{props.cantidad}</p>
            <label className={labelClass}>{props.title}</label>
        </div>
    );
}