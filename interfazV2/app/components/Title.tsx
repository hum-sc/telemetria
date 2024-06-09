import { Link, useLoaderData, useMatches, useSearchParams } from "@remix-run/react";
import Icon from "./Icon";
import { LoaderFunction } from "@remix-run/node";
//import { getUserSession } from "~/utils/sessions.server";
import { useEffect } from "react";

var title:string;

export default function Title(){
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get("redirectTo")
    const match = useMatches().filter(match => match.data&&match.data.title).pop();
    
    return(
        <>
            {/*
                (match?.data?.redirect&&match?.data?.title)?<Link to={redirectTo?redirectTo:match.data.redirect} className="display-small on-surface-text title">
                <Icon icon="arrow_back_ios" type="outlined" />
                {match.data.title}
            </Link>
            :<h2 className="display-small on-surface-text title">
            {match?.data?.title}
            </h2>*/
            }

            {
                match?.data.title &&  <h2 className="display-small on-surface-text title">
                {match?.data.title}
                </h2>
            }
        </>
    );
}