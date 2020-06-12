/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: Package Helpers
 * ==============================================================================
 */
/// <reference types="node" />
import { Duplex } from 'stream';
import Request from "./Request";
import Response from "./Response";
import { OptionalObject } from "./interfaces/index";
declare const helpers: {
    Cipher: {
        hash: (string: string) => string;
        enCrypt: (text: string) => string;
        deCrypt: (text: string) => string;
    };
    parseCookies: (request: Request) => any;
    json: (res: Response, data: object) => void;
    sendFile: (req: Request, res: Response, file: any) => void;
    bufferToStream: (buffer: any) => Duplex;
    warnings: {
        router: {
            called: boolean;
            text: string;
        };
    };
    compileETag: (val: any) => any;
    compileQueryParser: (val: any) => any;
    parseExtendedQueryString: (str: string) => any;
    newObject: () => {};
    compileTrust: (val: any) => any;
    setCharset(type: string, charset: any): string;
    validation: {
        strip_html_tags: (str: string) => string | false;
        checkEmail: (string: string, cb: Function) => any;
        notEmptyString: (string: string, cb: Function) => any;
        checkContainsNumber: (string: string, count: number, cb: Function) => any;
        isObject: (obj: OptionalObject) => false | OptionalObject;
        notEmpty: (obj: OptionalObject) => false | OptionalObject;
        isString: (str: string) => string | false;
        checkIsNumber: (element: string, cb: Function) => any;
    };
    serveAssets(req: Request, res: Response, next: Function): Promise<any>;
};
export default helpers;
