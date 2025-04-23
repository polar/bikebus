import {Component} from "react";

export interface RouteEntryOpts {
    name: string
}

export class RouteOperationEntry extends Component<RouteEntryOpts> {
    render() {
        return (
            <tr>
                <td><a className={"listItem route"} href={`/${this.props.name}`}>{this.props.name}</a></td>
                <td><a className={"listItem operate"} href={`/${this.props.name}/op`}>Operate</a></td>
            </tr>
        )
    }
}
