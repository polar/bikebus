import React from "react";
import {
    Button,
    ButtonGroup,
    SvgIcon,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import "./ArchiveList.css"

interface ArchiveListProps {
    prefix: string,
}

type Archive = {
    name: string
}

interface ArchiveListState {
    archive: Archive[]
    page: number
}

export class ArchiveList extends React.Component<ArchiveListProps, ArchiveListState> {

    state: ArchiveListState = {
        archive: [],
        page: 0
    }

    componentDidMount() {
        fetch("/api/archive")
            .then(res => res.json())
            .then(json => {
                let archive = json.sort((a: Archive, b: Archive) => a.name.localeCompare(b.name));
                this.setState({ archive: archive });
            })
    }

    deleteMake(name: string) {
        fetch(`/api/archive/${name}`, {
            method: "DELETE"
        })
            .then(res => res.json() as unknown as Archive[])
            .then((json : Archive[]) => {
                this.setState({archive:json});
            })
    }

    restore(name: string) {
        fetch(`/api/archive/${name}/restore`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                archived: false
            })
        })
            .then(res => res.json() as unknown as Archive[])
            .then((json : Archive[]) => {
                this.setState({archive:json});
            })
    }

    Delete(name: string) {
        return (
            <ButtonGroup>
                <Button onClick={() => this.deleteMake(name)} title={"Delete"}>
                    <SvgIcon>
                        <svg height="800px" width="800px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
<style type="text/css">
	{'.st0{fill:#000000;}'}
</style>
                            <g>
	<path className="st0" d="M308.229,51.853C308,23.183,284.751,0.017,256,0c-28.734,0.017-52,23.183-52.228,51.853
		c-63.821,9.2-109.796,33.323-109.796,49.845v16.718c0,20.784,72.538,37.625,162.024,37.625c89.486,0,162.024-16.841,162.024-37.625
		v-16.718C418.024,85.176,372.049,61.053,308.229,51.853z M256,48.065c-6.245,0-12.376,0.196-18.433,0.498
		c0.735-3.715,2.547-6.996,5.144-9.616c3.445-3.437,8.049-5.494,13.289-5.51c5.257,0.017,9.845,2.073,13.306,5.51
		c2.595,2.62,4.408,5.902,5.135,9.616C268.384,48.261,262.245,48.065,256,48.065z"/>
                                <path className="st0" d="M256,178.335c-89.486,0-162.024-16.841-162.024-37.625l18.53,316.253C112.506,478.506,167.233,512,256,512
		c88.767,0,143.51-33.494,143.51-55.037l18.514-316.253C418.024,161.494,345.486,178.335,256,178.335z M158.588,421.682
		l-6.661-195.134c4.465,1.02,9.249,1.878,14.269,2.743l6.752,197.878C167.763,425.436,162.988,423.567,158.588,421.682z
		 M217.176,436.98l-3.609-202.278c4.637,0.318,9.339,0.629,14.123,0.784l3.608,202.98C226.433,438.074,221.722,437.6,217.176,436.98
		z M294.824,436.98c-4.547,0.62-9.339,1.094-14.196,1.486l3.608-202.98c4.784-0.155,9.494-0.466,14.123-0.784L294.824,436.98z
		 M353.412,421.682c-4.392,1.886-9.175,3.755-14.351,5.486l6.744-197.878c5.02-0.865,9.803-1.796,14.277-2.743L353.412,421.682z"/>
</g>
</svg>

                    </SvgIcon>
                </Button>
            </ButtonGroup>
        )
    }

    RestoreButton(name: string) {
        return (
            <ButtonGroup>
                <Button onClick={() => this.restore(name)} title={"Restore to Routes"}>
                    <SvgIcon>
                        <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21.706 5.292-2.999-2.999A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.292A.994.994 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a.994.994 0 0 0-.294-.708zM6.414 4h11.172l1 1H5.414l1-1zM4 19V7h16l.002 12H4z"/><path d="M7 14h3v3h4v-3h3l-5-5z"/></svg>
                    </SvgIcon>
                </Button>
            </ButtonGroup>
        )
    }
    Download(name: string) {
        return (
            <ButtonGroup>
                <Button download={`${name}.json`} href={`/api/archive/${name}`} title={"Download"}>
                    <SvgIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24"
                             viewBox="0 0 24 24" width="24">
                            <g>
                                <rect fill="none" height="24" width="24"/>
                            </g>
                            <g>
                                <path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/>
                            </g>
                        </svg>
                    </SvgIcon>
                </Button>
            </ButtonGroup>
        )
    }

    drawElement(make: Archive, index: number) {
        return (
            <TableRow key={index}>
                <TableCell><a href={`${this.props.prefix}/archive/${make.name}`}>{make.name}</a></TableCell>
                <TableCell>{this.Download(make.name)}</TableCell>
                <TableCell>{this.Delete(make.name)}</TableCell>
                <TableCell>{this.RestoreButton(make.name)}</TableCell>
            </TableRow>
        )
    }

    render() {
        return (
            <TableContainer className={"tableContainer"}>
                <TableHead>
                    <TableRow>
                        <TableCell>Route</TableCell>
                        <TableCell>Download</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Restore</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.archive.map((make: Archive, i) => this.drawElement(make, i))}
                </TableBody>
            </TableContainer>
        )
    }
}
