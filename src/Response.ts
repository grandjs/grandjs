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
    [key:string]:any
    constructor(req:Request, res: Response) {
        super(req);
        this.req = req;
        setprototypeof(res, this);
    }
    // redirect method
    redirect(url:string) {
        try {
            this.writeHead(302, {
                Location: url
            });
            this.end();
            return this;
        } catch(err) {
            return this;
        }
    }
    // set status
    status(status:number, message?:string) {
        try {
            this.statusCode = status;
            this.statusMessage = message || "not found";
            return this;
        } catch(err) {
            return this;
        }
    }
    // json method
    json(obj:object) {
        try {
            this.writeHead(this.statusCode, { "content-type": "application/json"});
            let json = JSON.stringify(obj);
            this.end(json);
            return this;
        } catch(err) {
            return this;
        }
    }
    sendFile(file:string):this {
        try {
            helpers.sendFile(this.req, this, file);
            return this;
        } catch(err) {
            return this;
        }
    }
    render(Component:any, data:OptionalObject) {
        try {
            return View.render(this, Component, data);
        } catch(err) {
            return this;
        }
    }
}

export default Response;