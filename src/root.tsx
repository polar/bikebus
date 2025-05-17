// @ts-ignore
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes, useParams} from "react-router";
import {Main} from "./main.tsx";
import FrontPage from "./pages/FrontPage/FrontPage.tsx";
import OperatePage from "./pages/FrontPage/OperatePage.tsx";
import {MakerPage} from "./pages/MakerPage/MakerPage.tsx";
import {LoadPage} from "./pages/MakerPage/LoadPage.tsx";
import {EditChooserPage} from "./pages/MakerPage/EditChooserPage.tsx";
import {DirectionsPage} from "./pages/MakerPage/DirectionsPage.tsx";

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

function Editor() {
    let {route} = useParams()
    if (route && route != "") {
        return (<LoadPage name={route} copy={false}/>)
    } else {
        return (<MakerPage/>)
    }
}

function CopyEditor() {
    let {route} = useParams()
    if (route && route != "") {
        return (<LoadPage name={route} copy={true}/>)
    } else {
        return (<MakerPage/>)
    }
}

ReactDOM.createRoot(root!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/directions" element={<DirectionsPage/>} />
            <Route path="/list" element={<EditChooserPage/>} />
            <Route path="/make/:route" element={<Editor/>} />
            <Route path="/make/:route/copy" element={<CopyEditor/>} />
            <Route path="/make" element={<MakerPage/>} />
            <Route path="/op" element={<OperatePage api={"/api/tracker/routes"}/>} />
            <Route path="/" element={<FrontPage api={"/api/tracker/routes"}/>} />
            <Route path="/:name" element={<App op={false}/>} />
            <Route path="/:name/op" element={<App op={true}/>} />
        </Routes>
    </BrowserRouter>
);
