/// <reference types="node" />
/**
 * @package @Grandjs
 * @author Tarek Salem
 * MIT License
 */
/**
 * ==============================================================================
 * File Role: HTTP Response Object
 * ==============================================================================
 */
import http from "http";
import { ResponseInterface, OptionalObject } from './interfaces/index';
import Request from "./Request";
declare class Response extends http.ServerResponse implements ResponseInterface {
    req: Request;
    res: Response;
    [key: string]: any;
    constructor(req: Request, res: Response);
    redirect(url: string): this;
    status(status: number, message?: string): this;
    json(obj: object): this;
    sendFile(file: string): this;
    render(Component: any, data: OptionalObject): void;
}
export default Response;
