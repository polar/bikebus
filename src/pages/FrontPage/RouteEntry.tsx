import {Component} from "react";

export interface RouteEntryOpts {
    name: string
}

export class RouteEntry extends Component<RouteEntryOpts> {
    render() {
        return (
            <tr>
                <td><a className={"listItem route"} href={`/${this.props.name}`}>{this.props.name}</a></td>
            </tr>
        )
    }
}
