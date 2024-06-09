import { NavItemType } from "~/routes/rh";
import NavItem from "./NavItem";
import Button from "./Button";
import { logout } from "~/utils/sessions.server";

export default function NavigationDrawer(props:{links:NavItemType[]}) {
    
    return (
        <nav>
            <div aria-disabled className="top">
                <h1 className="title-medium">Recursos Humanos</h1>
                
                {
                    props.links.map((item)=><NavItem
                        key={item.title}
                        name={item.title}
                        link = {item.link}
                        icon = {item.icon}
                        end = {item.end}
                    />)
                }
            </div>
            <div aria-disabled className="bottom">
                <form action="/logout" method="post">
                <Button className="logout" icon="logout" color="error" label="Cerrar Sesión" type="submit" variant="outlined"/>
                </form>
            </div>
            
        </nav>
    );
}