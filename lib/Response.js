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
        this.writeHead(302, {
            Location: url
        });
        this.end();
        return this;
    }
    // set status
    status(status, message) {
        this.statusCode = status;
        this.statusMessage = message || "not found";
        return this;
    }
    // json method
    json(obj) {
        this.writeHead(this.statusCode, { "content-type": "application/json" });
        let json = JSON.stringify(obj);
        this.end(json);
        return this;
    }
    render(Component, data) {
        return View_1.View.render(this, Component, data);
    }
}
exports.default = Response;
