import Router from "../Router";
const {ComponentParser} = require("../ComponentParser")

const ApplicationServer = (props: {port:number}) => {
    return (
        <server port={props.port}>
        </server>
    )
}




module.exports = ApplicationServer;