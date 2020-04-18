/// <reference types="node" />
import handlebars from "handlebars";
import { Duplex } from 'stream';
import Request from "./Request";
import Response from "./Response";
declare const helpers: {
    hash: (string: string) => false | Buffer;
    enCrypt: (text: string) => string;
    deCrypt: (text: string) => string;
    parseCookies: (request: Request) => any;
    render: (options: any) => void;
    json: (res: Response, data: object) => void;
    sendFile: (req: Request, res: Response, file: any, cb: Function) => void;
    bufferToStream: (buffer: any) => Duplex;
    warnings: {
        router: {
            called: boolean;
            text: string;
        };
    };
    handlebars: typeof handlebars;
    compileETag: (val: any) => any;
    compileQueryParser: (val: any) => any;
    parseExtendedQueryString: (str: string) => any;
    newObject: () => {};
    compileTrust: (val: any) => any;
    setCharset(type: string, charset: any): string;
};
export default helpers;
