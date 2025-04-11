
import "./FrontPage.css"

export default function () {
    return (
        <div className="container">
            <div>
                <img src={"/api/planets-align.jpg"} alt={"background"}/>
            </div>
            <div className={"overlay"}>
                <h1 className={"name"}>Adiron, LLC</h1>
                    <a className={"listItem route"} href={"/nottingham"}>Nottingham</a>
                    <a className={"listItem operate"} href={"/nottingham/op"}>Operate</a>
            </div>
        </div>
    )

}
