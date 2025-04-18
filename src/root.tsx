// @ts-ignore
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, useParams} from "react-router";
import {Main} from "./main.tsx";
import FrontPage from "./pages/FrontPage/FrontPage.tsx";

const root = document.getElementById("root");

function App(props: {op: boolean}) {
    let params = useParams()
    let name = params.name;

    if (name) {
        return (<Main operator={props.op} name={name}/>)
    } else {
        return (
            <div>
                Invalid Name, please specify a valid route.
            </div>
        )
    }
}

ReactDOM.createRoot(root!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage/>} />
            <Route path="/:name" element={<App op={false}/>} />
            <Route path="/:name/op" element={<App op={true}/>} />
        </Routes>
    </BrowserRouter>
);
