/// <reference types="node" />
import http from "http";
import { ResponseInterface, OptionalObject } from './interfaces/index';
import Request from "./Request";
declare class Response extends http.ServerResponse implements ResponseInterface {
    req: Request;
    res: Response;
    constructor(req: Request, res: Response);
    redirect(url: string): this;
    status(status: number, message?: string): this;
    json(obj: object): this;
    render(Component: any, data: OptionalObject): void;
}
export default Response;
