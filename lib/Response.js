"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const http_1 = __importDefault(require("http"));
const helpers_1 = __importDefault(require("./helpers"));
const setprototypeof_1 = __importDefault(require("setprototypeof"));
const View_1 = require("./View");
class Response extends http_1.default.ServerResponse {
    constructor(req, res) {
        super(req);
        this.req = req;
        setprototypeof_1.default(res, this);
    }
    // redirect method
    redirect(url) {
        try {
            this.writeHead(302, {
                Location: url
            });
            this.end();
            return this;
        }
        catch (err) {
            return this;
        }
    }
    // set status
    status(status, message) {
        try {
            this.statusCode = status;
            this.statusMessage = message || "not found";
            return this;
        }
        catch (err) {
            return this;
        }
    }
    // json method
    json(obj) {
        try {
            this.writeHead(this.statusCode, { "content-type": "application/json" });
            let json = JSON.stringify(obj);
            this.end(json);
            return this;
        }
        catch (err) {
            return this;
        }
    }
    sendFile(file) {
        try {
            helpers_1.default.sendFile(this.req, this, file);
            return this;
        }
        catch (err) {
            return this;
        }
    }
    render(Component, data) {
        try {
            return View_1.View.render(this, Component, data);
        }
        catch (err) {
            return this;
        }
    }
}
exports.default = Response;
