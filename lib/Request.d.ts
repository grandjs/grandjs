/// <reference types="node" />
/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: View HTTP Request Object
 * ==============================================================================
 */
import { RequestInterface, OptionalObject } from './interfaces/index';
import http from 'http';
import { Socket } from 'net';
import Url from 'url';
import { BaseServer } from "./Server";
import parseRange from 'range-parser';
declare class Request extends http.IncomingMessage implements RequestInterface {
    [key: string]: any;
    path: string;
    url: string;
    pathname: string;
    href: string;
    parsedUrl: Url.Url;
    params: OptionalObject;
    query: OptionalObject;
    data: OptionalObject;
    body: OptionalObject;
    files: OptionalObject;
    method: string;
    statusCode: number;
    Server: BaseServer;
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
    constructor(socket: Socket, request: Request, Server: BaseServer);
    protected parseUrl(): void;
    accepts(): any;
    acceptsEncodings: () => any;
    acceptsCharsets: () => any;
    acceptsLanguages: () => any;
    range(size: number, options: any): -1 | -2 | parseRange.Ranges;
    header(name: string): string | string[];
    is(types: any[]): string | false;
    xhr(): boolean;
}
export default Request;
