

export type Header = {
    name:string,
    size:"fit-content"|"100%"|number,
    
}

export type Row = {
    id: string|number,
    data: string[],
};
/**
 * 
 * @param props 
 * @returns 
 */
export default function Tabla(props:{headers:string[],rows:Row[], onRowSelected:(index:any)=>void}) {

    return(
        <div className="tableContainer">
            <table>
                <thead>
                    <tr className="header">
                        {props.headers.map((header,index) => {
                            return <th className="hader-small on-surface-variant-text"  key={index}>{header}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {
                        props.rows.map((row,index) => {
                            return <tr key={row.id} onClick={()=>props.onRowSelected(row.id)}>
                                {row.data.map((cell,index) => {
                                    return <td className="body-large on-surface-variant-text" key={index} >{cell}</td>
                                })}
                            </tr>     
                        })
                    }

                </tbody>
            </table>
        </div>
    );

}