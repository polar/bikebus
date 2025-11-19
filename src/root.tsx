// @ts-ignore
import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes, useParams} from "react-router";
import {PreLoadOperatorTrackerPages} from "./PreLoadOperatorTrackerPages.tsx";
import FrontPage from "./pages/FrontPage/FrontPage.tsx";
import OperatePage from "./pages/FrontPage/OperatePage.tsx";
import {MakerPage} from "./pages/MakerPage/MakerPage.tsx";
import {LoadPage} from "./pages/MakerPage/LoadPage.tsx";
import {DirectionsPage} from "./pages/MakerPage/DirectionsPage.tsx";
import {DrawerPage} from "./pages/DrawPage/DrawerPage.tsx";
import {DrawsPage} from "./pages/DrawsPage/DrawsPage.tsx";
import {DrawShowPage} from "./pages/DrawShowPage/DrawShowPage.tsx";
import {HOST} from "./Settings.ts"
import {MakesPage} from "./pages/MakesPage/MakesPage.tsx";
import {ArchivePage} from "./pages/ArchivePage/ArchivePage.tsx";
import {ArchiveShowPage} from "./pages/ArchiveShowPage/ArchiveShowPage.tsx";

const root = document.getElementById("root");

function MakeEditor(props: {prefix: string}) {
    let {route} = useParams()
    if (route && route != "") {
        return (<LoadPage prefix={props.prefix} name={route} copy={false}/>)
    } else {
        return (<MakerPage prefix={props.prefix}/>)
    }
}

function MakeCopyEditor(props: {prefix: string}) {
    let {route} = useParams()
    if (route && route != "") {
        return (<LoadPage prefix={props.prefix} name={route} copy={true}/>)
    } else {
        return (<MakerPage prefix={props.prefix}/>)
    }
}


function OperatorOrTrackerShower(props: {op : boolean}) {
    let {device, route} = useParams()
    if (route && route != "")
        switch(device) {
            case "android":
                return (<PreLoadOperatorTrackerPages prefix={`/${device}`} operator={props.op} name={route} enableTracker={false}/>)
            case "desktop":
                return (<PreLoadOperatorTrackerPages prefix={`/${device}`} operator={props.op} name={route} enableTracker={props.op}/>)
            default:
                return (<PreLoadOperatorTrackerPages prefix={`/desktop`} operator={props.op} name={route} enableTracker={props.op}/>)
        }
    else
        return (<div>
            Invalid Name, please specify a valid route.
        </div>)
}
function Drawer() {
    let {device, name} = useParams()
    switch(device) {
        case "android":
            return (<DrawerPage prefix={`/${device}`} name={name} enableTracker={false}/>)
        case "desktop":
            return (<DrawerPage prefix={`/${device}`} name={name} enableTracker={!name}/>)
        default:
            return (<DrawerPage prefix={`/desktop`} name={name} enableTracker={!name}/>)
    }
}

function DrawShower() {
    let {device, name} = useParams()
    name = name || ""
    switch(device) {
        case "android":
            return (<DrawShowPage prefix={`/${device}`} name={name}/>)
        case "desktop":
            return (<DrawShowPage prefix={`/${device}`} name={name}/>)
        default:
            return (<DrawShowPage prefix={`/desktop`} name={name}/>)

    }
}
function ArchiveMakeShower() {
    let {device, name} = useParams()
    name = name || ""
    switch(device) {
        case "android":
            return (<ArchiveShowPage prefix={`/${device}`} name={name}/>)
        case "desktop":
            return (<ArchiveShowPage prefix={`/${device}`} name={name}/>)
        default:
            return (<ArchiveShowPage prefix={`/desktop`} name={name}/>)

    }
}

function DrawListShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<DrawsPage prefix={`/${device}`}/>)
        case "desktop":
            return (<DrawsPage prefix={`/${device}`}/>)
        default:
            return (<DrawsPage prefix={`/desktop`}/>)

    }
}

function DirectionsShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<DirectionsPage prefix={`/${device}`} host={HOST}/>)
        case "desktop":
            return (<DirectionsPage prefix={`/${device}`} host={HOST}/>)
        default:
            return (<DirectionsPage prefix={`/desktop`} host={HOST}/>)

    }
}

function MakesListShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<MakesPage prefix={`/${device}`}/>)
        case "desktop":
            return (<MakesPage prefix={`/${device}`}/>)
        default:
            return (<MakesPage prefix={`/desktop`}/>)

    }
}
function ArchiveShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<ArchivePage prefix={`/${device}`}/>)
        case "desktop":
            return (<ArchivePage prefix={`/${device}`}/>)
        default:
            return (<ArchivePage prefix={`/desktop`}/>)

    }
}

function MakeEditorShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<MakeEditor prefix={`/${device}`}/>)
        case "desktop":
            return (<MakeEditor prefix={`/${device}`}/>)
        default:
            return (<MakeEditor prefix={`/desktop`}/>)

    }
}

function MakeCopyEditorShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<MakeCopyEditor prefix={`/${device}`}/>)
        case "desktop":
            return (<MakeCopyEditor prefix={`/${device}`}/>)
        default:
            return (<MakeCopyEditor prefix={`/desktop`}/>)

    }
}

function MakerShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<MakerPage prefix={`/${device}`}/>)
        case "desktop":
            return (<MakerPage prefix={`/${device}`}/>)
        default:
            return (<MakerPage prefix={`/desktop`}/>)

    }
}

function FrontPageShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<FrontPage prefix={`/${device}`} displayGetApp={false} displayNavigation={false} displayOperator={true}/>)
        case "desktop":
            return (<FrontPage prefix={`/${device}`} displayGetApp={true} displayNavigation={true} displayOperator={false}/>)
        default:
            return (<FrontPage prefix={`/desktop`}  displayGetApp={true} displayNavigation={true} displayOperator={false}/>)

    }
}
function ObserveOnlyFrontPageShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<FrontPage prefix={`/${device}`}  displayGetApp={false} displayNavigation={false} displayOperator={false}/>)
        case "desktop":
            return (<FrontPage prefix={`/${device}`} displayGetApp={true}  displayNavigation={false} displayOperator={false}/>)
        default:
            return (<FrontPage prefix={`/desktop`} displayGetApp={true}  displayNavigation={false} displayOperator={false}/>)

    }
}

function OperatorPageShower() {
    let {device} = useParams()
    switch(device) {
        case "android":
            return (<OperatePage prefix={`/${device}`} show={["draw"]}/>)
        case "desktop":
            return (<OperatePage prefix={`/${device}`} show={["all"]}/>)
        default:
            return (<OperatePage prefix={`/desktop`} show={["all"]}/>)

    }
}

ReactDOM.createRoot(root!).render(
    <BrowserRouter>
        <Routes>


            <Route path="/:device/draw/:name/op" element={<Drawer/>} />
            <Route path="/:device/draw/:name" element={<Drawer/>} />
            <Route path="/:device/draw" element={<Drawer/>} />
            <Route path="/:device/directions" element={<DirectionsShower/>} />
            <Route path="/:device/draws" element={<DrawListShower/>} />
            <Route path="/:device/draws/:name" element={<DrawShower/>} />
            <Route path="/:device/makes" element={<MakesListShower/>} />
            <Route path="/:device/archive" element={<ArchiveShower/>} />
            <Route path="/:device/archive/:name" element={<ArchiveMakeShower/>} />
            <Route path="/:device/make/:route" element={<MakeEditorShower/>} />
            <Route path="/:device/make/:route/copy" element={<MakeCopyEditorShower/>} />
            <Route path="/:device/make" element={<MakerShower/>} />
            <Route path="/:device/observe" element={<ObserveOnlyFrontPageShower/>} />
            <Route path="/:device/home" element={<FrontPageShower/>} />
            <Route path="/:device/operator" element={<OperatorPageShower/>} />
            <Route path="/:device/tracker/op" element={<OperatorPageShower/>} />
            <Route path="/:device/tracker" element={<FrontPageShower/>} />
            <Route path="/:device/tracker/:route/op" element={<OperatorOrTrackerShower op={true}/>} />
            <Route path="/:device/tracker/:route" element={<OperatorOrTrackerShower op={false}/>} />


            <Route path="/makes" element={<MakesListShower/>} />
            <Route path="/make" element={<MakerShower/>} />
            <Route path="/op" element={<OperatePage prefix={"/desktop"} show={[]}/>} />
            <Route path="/" element={<FrontPage prefix={"/desktop"} displayGetApp={true}  displayNavigation={false} displayOperator={false}/>} />
        </Routes>
    </BrowserRouter>
);
