// @ts-ignore
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, useParams} from "react-router";
import {Main} from "./main.tsx";
import FrontPage from "./pages/FrontPage/FrontPage.tsx";
import OperatePage from "./pages/FrontPage/OperatePage.tsx";
import {MakerPage} from "./pages/MakerPage/MakerPage.tsx";

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
            <Route path="/make" element={<MakerPage/>} />
            <Route path="/op" element={<OperatePage api={"/api/tracker/routes"}/>} />
            <Route path="/" element={<FrontPage api={"/api/tracker/routes"}/>} />
            <Route path="/:name" element={<App op={false}/>} />
            <Route path="/:name/op" element={<App op={true}/>} />
        </Routes>
    </BrowserRouter>
);
