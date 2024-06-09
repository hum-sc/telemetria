export default function InformacionGeneral(props:{label:string, content:string, variant:"line"|"default", type:"filled"|"transparent"}) {
    return(
        <div aria-disabled className={"informacion general "+(props.type)+" "+props.variant}>
            <label className="label-small">{props.label}</label>
            <p className="title-small">{props.content}</p>
        </div>
        
    )
}