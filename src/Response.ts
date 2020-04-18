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
import helpers from './helpers';
import Request from "./Request";
import setprototypeof from "setprototypeof";
import send from "send";
import {View} from "./View";
class Response extends http.ServerResponse implements ResponseInterface {
    req:Request;
    res:Response
    constructor(req:Request, res: Response) {
        super(req);
        this.req = req;
        setprototypeof(res, this);
    }
    // redirect method
    redirect(url:string) {
        this.writeHead(302, {
            Location: url
        });
        this.end();
        return this;
    }
    // set status
    status(status:number, message?:string) {
        this.statusCode = status;
        this.statusMessage = message || "not found";
        return this;
    }
    // json method
    json(obj:object) {
        this.writeHead(this.statusCode, { "content-type": "application/json"});
        let json = JSON.stringify(obj);
        this.end(json);
        return this;
    }
    render(Component:any, data:OptionalObject) {
        return View.render(this, Component, data);
    }
}

export default Response;