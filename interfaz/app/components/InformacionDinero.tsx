export default function InformacionDinero(props:{type:"positivo"|"negativo", variant:"pequeño"|"grande", cantidad:number, title:string}){
    const pClass = props.variant == "pequeño" ? "headline-small" : "display-large";
    const labelClass = props.variant == "pequeño" ? "label-small" : "display-small";
    return(
        <div className={"informacion cantidad dinero "+props.type+" "+props.variant}>
            <p className={pClass}>{props.cantidad}</p>
            <label className={labelClass}>{props.title}</label>
        </div>
    );
}