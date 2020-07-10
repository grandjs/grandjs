import Router from "../Router";
interface Constructable {
    (props:{port:number});
}
const {ComponentParser} = require("../ComponentParser")
const ApplicationServer = ComponentParser.importJsx("src/components/test.tsx");
console.log(ApplicationServer({}))
const MyServer = () => {
    return (
        <ApplicationServer port={3000}/>
    )
}


module.exports = MyServer;