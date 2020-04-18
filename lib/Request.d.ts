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
import { RequestInterface } from './interfaces/index';
import http from 'http';
import { Socket } from 'net';
import Url from 'url';
import { BaseServer } from "./Server";
import parseRange from 'range-parser';
declare class Request extends http.IncomingMessage implements RequestInterface {
    path: string;
    url: string;
    pathname: string;
    href: string;
    parsedUrl: Url.Url;
    params: {};
    query: {};
    data: {};
    body: {};
    files: {};
    method: string;
    statusCode: number;
    Server: BaseServer;
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
