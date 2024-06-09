// import { cssBundleHref } from "@remix-run/css-bundle";
import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import globalStylesUrl from "~/styles/global.css?url";
export const loader: LoaderFunction = async ({ request, params }) => {
  return {
      title:"Sensor del medio"
  };
}


export const links: LinksFunction = () => [
  //...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet",  href:"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"},
  {rel: "stylesheet", href:'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'}
];


export function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
