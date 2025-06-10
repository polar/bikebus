import React, {JSX} from "react";
import ReactDOMServer from "react-dom/server";
import L, {divIcon, LatLngExpression} from "leaflet";
import {Marker, useMap} from "react-leaflet";

interface Coordinates {
    latitude: number,
    longitude: number
}

export interface MyLocation extends Coordinates {
    timestamp: number
    heading: number | null
}

interface MyLocationMarkerProps {
    name: string
    location?: MyLocation
    onLocationChange: (location: MyLocation) => void
    panMapToMarker: boolean
}

interface MyLocationMarkerState {
}

export class MyLocationMarker extends React.Component<MyLocationMarkerProps, MyLocationMarkerState> {


    markerRef: any = React.createRef()

    locationMarker() {
        let icon = "/api/Locator.svg"
        return (
            <div className={``}>
                <div className="marker-box marker-box-tracker">
                    <img src={icon} alt="marker"/>
                </div>
            </div>
        );
    }

    generalLocationMarker() {
        let icon = "/api/GeneralLocator.svg"
        return (
            <div className={``}>
                <div className="marker-box marker-box-tracker">
                    <img src={icon} alt="marker"/>
                </div>
            </div>
        )
    }

    createIcon(icon: JSX.Element, anchor: [number, number] = [5.5,22.5]) {
        let element = ReactDOMServer.renderToString(icon)
        return divIcon({className: '', html: element, iconAnchor: anchor})
    }

    glIcon() {
        return this.createIcon(this.generalLocationMarker(),[5.5,22.5])
    }
    dlIcon() {
        return this.createIcon(this.locationMarker(),[6, 26])
    }

    applyRotation(marker:any, _options: any) {
        const oldIE = L.DomUtil.TRANSFORM === "msTransform";
        const options = Object.assign(_options, { rotationOrigin: "center 25px" });
        const { rotationAngle, rotationOrigin } = options;

        if (rotationAngle && marker) {
            marker._icon.style[L.DomUtil.TRANSFORM + "Origin"] = rotationOrigin;

            if (oldIE) {
                // for IE 9, use the 2D rotation
                marker._icon.style[L.DomUtil.TRANSFORM] = `rotate(${rotationAngle} deg)`;
            } else {
                // for modern browsers, prefer the 3D accelerated version
                marker._icon.style[
                    L.DomUtil.TRANSFORM
                    ] += ` rotateZ(${rotationAngle}deg)`;
            }
        }
    }

    myLocation : MyLocation = {
        timestamp: 0,
        latitude: 0,
        longitude: 0,
        heading: null,
    }

    previousHeadingNullCount = 0
    success(pos:any, notify = true) {

        if (this.myLocation.latitude != pos.coords.latitude || this.myLocation.longitude != pos.coords.longitude) {
            this.markerRef.current?.setLatLng([pos.coords.latitude, pos.coords.longitude])
            this.myLocation.latitude = pos.coords.latitude
            this.myLocation.longitude = pos.coords.longitude
        }
        if (this.props.panMapToMarker) {
            try {
                this.map?.panTo([pos.coords.latitude, pos.coords.longitude] as LatLngExpression);
            } catch (e) {
                alert({coords: [pos.coords.latitude, pos.coords.longitude], error: e })
            }
        }

        if (pos.coords.heading !== null) {
            if (this.myLocation.heading == null) {
                this.markerRef.current?.setIcon(this.dlIcon())
                this.applyRotation(this.markerRef.current, { rotationAngle: pos.coords.heading})
                this.myLocation.heading = pos.coords.heading
            } else if (this.myLocation.heading !== pos.coords.heading) {
                this.markerRef.current?.setIcon(this.dlIcon())
                this.myLocation.heading = pos.coords.heading
                this.applyRotation(this.markerRef.current, { rotationAngle: pos.coords.heading})
            }
        } else {
            if (++this.previousHeadingNullCount > 10) {
                this.markerRef.current?.setIcon(this.glIcon())
                this.markerRef.current?.setLatLng([this.myLocation.latitude, this.myLocation.longitude])
                this.previousHeadingNullCount = 0
                this.myLocation.heading = null
            }
        }
        if (this.props.onLocationChange && notify) {
            this.props.onLocationChange(this.myLocation)
        }
    }

    error(err: any) {
        console.error(`ERROR(${err.code}): ${err.message}`);
    }

    geoLocationId? : number

    enableLocation() {
        let options = {
            enableHighAccuracy: true,
            //timeout: 5000,
            maximumAge: 5000,
        };

        this.geoLocationId = navigator.geolocation.watchPosition(this.success.bind(this), this.error, options);
    }

    mounted = false
    componentDidMount() {
        this.mounted = true
        this.enableLocation()
        if (this.props.location) {
            this.myLocation =  {
                timestamp: this.props.location.timestamp,
                latitude: this.props.location.latitude,
                longitude: this.props.location.longitude,
                heading: this.props.location.heading,
            }
        }

        // setInterval(() => {
        //     if (this.myLocation) {
        //         // @ts-ignore
        //         let heading = ((this.myLocation.heading || 0)+ 10) % 360
        //         this.success({
        //             timestamp: this.myLocation.timestamp,
        //             coords: {
        //                 latitude: this.myLocation.latitude+0.0001,
        //                 longitude: this.myLocation.longitude+0.0001,
        //                 heading: heading,
        //             } as any,
        //         })
        //     }
        // }, 1000)
    }

    componentWillUnmount() {
        this.mounted = false
        if (this.geoLocationId) {
            navigator.geolocation.clearWatch(this.geoLocationId);
        }
        this.myLocation = {
            timestamp: 0,
            latitude: 0,
            longitude: 0,
            heading: null,
        }
    }

    map: L.Map | undefined

    setRef() {
        if (!this.mounted) {
            if (this.props.location) {
                this.myLocation =  {
                    timestamp: this.props.location.timestamp,
                    latitude: this.props.location.latitude,
                    longitude: this.props.location.longitude,
                    heading: this.props.location.heading,
                }
            }
        }
        this.markerRef.current?.setLatLng([this.myLocation.latitude, this.myLocation.longitude])
        if (this.props.panMapToMarker) {
            try {
                this.map?.panTo([this.myLocation.latitude, this.myLocation.longitude] as LatLngExpression);
            } catch (e) {
                alert({coords: [this.myLocation.latitude, this.myLocation.longitude], error: e })
            }
            if (this.myLocation.heading == null) {
                this.markerRef.current?.setIcon(this.glIcon())
            } else {
                this.markerRef.current?.setIcon(this.dlIcon())
                this.applyRotation(this.markerRef.current, { rotationAngle: this.myLocation.heading})
            }
        }
    }
    render() {
        this.map = useMap()
        let position = [0,0] as LatLngExpression
        if (this.props.location) {
            position = [this.props.location.latitude, this.props.location.longitude] as LatLngExpression
        }
        if (this.mounted && this.myLocation.latitude != 0 && this.myLocation.longitude != 0) {
            position = [this.myLocation.latitude, this.myLocation.longitude] as LatLngExpression
            if (this.props.panMapToMarker) {
                this.map.panTo(position)
            }
        }
        return (
            <div className={"marker-container marker-box"}>
                <Marker ref={this.markerRef} icon={this.glIcon()} position={position}/>
            </div>
        )
    }
}
