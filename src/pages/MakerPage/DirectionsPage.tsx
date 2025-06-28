import React from "react";
import {SvgIcon} from "@mui/material";


interface DirectionsPageProps {
    prefix: string
    host: string
}

export class DirectionsPage extends React.Component<DirectionsPageProps, {}> {

    DirectionsIcon() {
        return (
            <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><g><rect fill="none" height="24" width="24"/></g><g><path d="m21.41 10.59-7.99-8c-.78-.78-2.05-.78-2.83 0l-8.01 8c-.78.78-.78 2.05 0 2.83l8.01 8c.78.78 2.05.78 2.83 0l7.99-8c.79-.79.79-2.05 0-2.83zM13.5 14.5V12H10v3H8v-4c0-.55.45-1 1-1h4.5V7.5L17 11l-3.5 3.5z"/></g></svg>
            </SvgIcon>
        )
    }

    MapIcon() {
        return (
            <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
            </SvgIcon>
        )
    }
    CloudDownloadIcon() {
        return (
            <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
            </SvgIcon>
        )
    }
    DownloadFileIcon() {
        return (
            <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
            </SvgIcon>
        )
    }
    UploadCloudIcon() {
        return (
            <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
            </SvgIcon>
        )
    }

    PlaceIcon() {
        return (
            <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </SvgIcon>
        )
    }

    TrashIcon() {
        return (
            <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </SvgIcon>
        )
    }
    render() {
        return (
            <div>
                <h1>Directions for Browsers (Phone or Desktop)</h1>
                <h2>Observing the Route Tracking</h2>
                <p>
                    If you are looking for the Bike Bus for a particular route, you just go to
                    the home page <a href={`${this.props.prefix}/`}>https://{this.props.host}</a> and
                    you will be presented with a list of available routes. Click on the link for your desired
                    route. If somebody is operating the route from their phone, you should see the bus icon on your
                    map.  It updates about once every 10 seconds or so, so you should see it moving if the group is
                    moving. If the bus icon disappears, it means that the group has stopped the tracker.
                </p>
                <h2>Operating the Route</h2>
                <p>
                    If you are planning on tracking the group, open a browser on your phone and go to <a href={`${this.props.prefix}/op`}>https://{this.props.host}/op</a>.
                    This url will bring you to a list of routes on our system. To "operate" the route, click on the "Operate" link
                    next to the route you want to operate.
                </p>
                <p>
                    You will be presented with the route displayed on the map, and there will be a green "GO" button in
                    the top right corner. If you press the "GO" button, you may be asked to share your location.
                    If you deny this capability, tracking will not work. You must go to your settings and re-enable it.
                </p>
                <p>
                    You must keep your phone alive while you are using it. Most phones have a 'time to sleep' setting.
                    Most phones can be set to stay alive for up to 30 minutes. Otherwise, you just have to
                    keep touching your phone to keep the screen alive. You must keep the phone on the page for the
                    tracking to work. If the phone goes to sleep it will stop sending locations to our servers.
                </p>
                <p>
                    <b>NOTE:</b> Experience has told us that the iPhone is not good at staying alive and to keep
                    reporting your location. In using a phone's browser, the Android is better at operating the route
                </p>
                <h2>Android App</h2>
                <p>
                    There will soon be an Android app on the Google Store for Bike Bus. It is called "Bike Bus".
                    Tracking is much better if you are
                    using the Android app as it uses native Android capabilities to track your location.
                </p>
                <p>
                    The Android app has the ability to turn on tracking and have it work in the background. So, you
                    can start tracking by hitting the "GO" button and then you
                    can put your phone in a pocket and not worry about it. The app will stop after one hour from the
                    minute you hit the "GO" button. You may reset it at any time by hitting the "GO" button to stop
                    tracking and immediately hit the "GO" button again to track for another hour. The time limit is
                    so that if you forget about it, the app will not run your battery down by retrieving locations
                    in the background from the GPS unit on the phone and sending them to our servers.
                </p>
                <p>
                    The Android App may also be used to simply observe the route. And this may be all you need. However,
                    there will be buttons to operate the route, draw routes, etc. You may enabled operation of routes
                    by hitting on a special invisible button enough times to enable the operation screens.

                    The Android app will be available on the Google Play Store
                    at <a href="https://play.google.com/store/apps/details?id=com.adiron.bikebus">https://play.google.com/store/apps/details?id=com.adiron.bikebus</a>.
                    It will be free.
                </p>
                <h2>No iPhone App!</h2>
                <p>
                    If you are looking for an iPhone app, there will not be one. Apple Development is too costly and
                    requires special Apple equipment that this developer is not going to buy or maintain.
                </p>
                <h2>Make New Route From Scratch</h2>
                <p>
                    Making a new route is a bit tricky. You need to make a route on the Open Street Maps Route
                    Service website, and then import it into the Bike Bus system. The Open Street Maps Route Service
                    is at <a href="https://maps.openrouteservice.org">https://maps.openrouteservice.org</a> and works
                    best on a desktop computer. There are links to it on the Maker Page.
                </p>
                <p>
                    Go to <a href={`${this.props.prefix}/make`}>https://{this.props.host}/make</a> or use "MAKE NEW" button above.
                    This brings you to the "Maker" page.
                </p>
                <p>
                    You can go to the link <a href={"https://maps.openrouteservice.org"}>Create a New Route</a>, which
                    is <a href="https://maps.openrouteservice.org">https://maps.openrouteservice.org</a>.
                    It is the <a href={"https://openstreetmaps.org"}>Open Street Maps</a> Special Route Finding service.
                    It has biking profile to help direct the route through bike paths if available.
                </p>
                <p>
                    On the Open Street Maps Route Service Page, you go to the "Directions" { this.DirectionsIcon() }
                    icon and create your route. It is a bit tricky, but play with it.
                    It may require clicking on the "Map" icon { this.MapIcon()}
                    and then clicking on a location on the map, which will fill it in the sidebar.
                </p>
                <p>
                    Once you are done creating your route on that website, go to "<b>Route Details</b>" section of the sidebar on the
                    left and click on the Download { this.CloudDownloadIcon() }
                    button. This action brings up a Dialog. Perform the following:
                    <ul>
                        <li>Select "GeoJSON" for the "Download format". </li>
                        <li>Name the file in the "Download file name" to an appropriate name.</li>
                        <li>This will save the JSON file locally. Make sure you select the "GeoJSON" option!</li>
                        <li>Click on the "DOWLOAD" button</li>
                        <li>You may have to rename the file, depending if the file name already resides on your computer.</li>
                    </ul>
                    Once you do the procedure listed above, you are now ready to import this GeoJSON file into the
                    Bike Bus system.
                    Go to <a href={`${this.props.prefix}/make`}>https://{this.props.host}/make</a>.
                    <ul>
                        <li>Click on the "CHOOSE FILE" Button</li>
                        <li>Select your recently downloaded file</li>
                    </ul>
                    <p>
                        After this action, you will have to change the name in the upper text field, and you may edit
                        the way point names and placements, and select the bus icon to use.
                        Once you are satisfied, you may click on the "SAVE TO SERVER" button.
                    </p>
                    <p>
                        <b>NOTE:</b> You cannot alter the route on this page! If you need to alter the route, you need to
                        go back to the <a href={"https://maps.openrouteservice.org"}>https://maps.openrouteservice.org</a>
                        and redo the download process. You may alter an existing route, but following the instructions
                        in the next section. Also, the server has a limit of holding onto 20 routes. You may be denied
                        if there are too many.
                    </p>
                </p>
                <h2>Modifying an Existing Route</h2>
                <p>
                    <b>Please modify routes with a desktop computer that has a larger screen and a mouse.</b>
                </p>
                <p>
                    To modify a route, you go to <a href={`/${this.props.prefix}/make`}>https://{this.props.host}/make</a> and
                    click on your <a href={`${this.props.prefix}/makes`}>Edit List</a> link to bring to the list
                    of current routes. From there, you may select the route you want to alter.
                </p>
                <p>
                    <b>Please do not alter routes that do not belong to you!</b>
                </p>
                <p>
                    This action brings you to the page in which you may alter the way point names and placements, and
                    choose the bus icon. However, you <b>CANNOT</b> alter the route from this page because it does
                    not have any route finding capability. You must do the following to
                    bring the route and import it into
                    the <a href={"https://maps.openrouteservice.org"}>https://maps.openrouteservice.org</a> service
                    to alter the route.
                </p>
                <p>
                    From the Bike Bus route maker page, click on to the "Download" { this.DownloadFileIcon() } button
                    and save the file to your computer.
                    Next, go to the Open Route Service.
                    A convenience link <a href={"https://maps.openrouteservice.org"}>Create a New Route"</a> is
                    on the right.
                </p>
                <p>
                    From there on the Open Street Maps Route Service page, do the following:
                </p>
                <ul>
                    <li>Click on the "Directions" { this.DirectionsIcon() } button</li>
                    <li>Click on the Upload File { this.UploadCloudIcon()} button.</li>
                    <li>Choose the JSON file you just downloaded.</li>
                </ul>
                <p>
                    This will load the existing route.
                    You may now alter the route, add, remove, or alter waypoints, even move the
                    start and stop points. <b>However, the site is tricky. You must be careful with mouse clicks.</b>
                    Follow the below procedure.
                </p>
                <p>
                    Once the file is imported, the side bar will contain the waypoints and the route
                    will appear on the map. However, the "Route details" section will not
                    appear. <b>This state is fragile.</b> You may have to replay the process if it messes up.
                </p>
                <ul>
                    <li><b>Do NOT</b> click on the map other than to close any pop ups.</li>
                    <li><b>Do NOT</b> move the map. It will reroute and you will have to repeat the
                        process.</li>
                    <li>Click the "Add Place" { this.PlaceIcon() } button once.</li>
                    <li>Click the "Trash" { this.TrashIcon() } button to get rid of the extra place.
                        These actions will bring up the
                        "Route details" side bar.</li>
                </ul>
                <p>
                    You may now alter the route, and go through the download/import process
                    into <a href={`${this.props.prefix}/make`}>BikeBus Maker Page</a>.
                </p>
                <ul>
                    <li>Click on the "Download"  { this.CloudDownloadIcon() } button</li>
                    <li>Select "GeoJSON" for the "Download format". </li>
                    <li>Name the file in the "Download file name" to an appropriate name.</li>
                    <li>This will save the JSON file locally. Make sure you select the "GeoJSON" option!</li>
                    <li>Click on the "DOWNLOAD" button</li>
                    <li>You may have to rename the file, depending if the file name already resides on your computer.</li>
                </ul>
                <p>
                    From there you would go to the <a href={`${this.props.prefix}/make`}>Bike Bus Maker Page</a> page
                    and click on "CHOOSE FILE" button to import the route to the Bike Bus system.
                </p>
                <h2>Drawing a Route</h2>
                <p>
                    If you have an Android Phone, you can draw a route from the phone. From the Android Phone
                    click on the <a href={`${this.props.prefix}/draw`}>DRAW</a> button. This will bring up a map
                    where you can draw a route by driving, biking, or walking with the phone.
                </p>
                <p>
                    Once you go to this page, the Bike Bus system will give you a unique name for the "draw".
                    You must personally remember this name if you want to find it later.
                </p>
                <p>
                    You start drawing a route by clicking on the green "GO" button in the top right corner and
                    stop recording by hitting the "GO" button again. The "GO" button will pulse if it is recording.
                </p>
                <p>
                    If you are using the Android Bike Bus App, recording will happen in the background, so there is
                    no need for you to keep the phone alive on the page. You may put it in your pocket, pull it out,
                    and hit the "GO" button to stop recording. The route will be saved to the Bike Bus system. You
                    must remember the name given to the "draw".
                </p>
                <p>
                    From there, on the desktop,
                    you can go to the <a href={`${this.props.prefix}/draws`}>https://{this.props.host}/draws</a> and
                    download the Geo JSON file for the name you were given.
                </p>
                <p>
                    Once, you have the file, you can import it into the Bike Bus system. However, if you do that, you
                    will only get two way points, the start and finish. If you want to refine the route, you must
                    go to the Open Street Maps Route Service and import the route.
                </p>
                <p>
                    You can download a refined route to give to the Open Street Maps Route Service that will reduce
                    a number of recorded locations that are close together, and figure out way points that may
                    resemble turns that are over 30 degrees or so. It is not perfect, but will work better with the
                    Open Street Maps Route Service, because the service will only reroute between way points.
                </p>
            </div>
        )
    }
}
