import { RequestInterface, ServerInterface } from './interfaces/index';
import http from 'http'
import { Socket } from 'net'
import Url from 'url'
import {BaseServer} from "./Server";
import accepts from 'accepts'
import parseRange from 'range-parser'
import typeis from "type-is";

class Request extends http.IncomingMessage implements RequestInterface {
  path: string
  url: string
  pathname: string
  href: string
  parsedUrl: Url.Url
  params: {}
  query: {}
  data: {}
  body: {}
  files: {}
  method: string
  statusCode: number
  Server: BaseServer
  constructor (socket: Socket, request: Request, Server:BaseServer) {
    // Object.assign(this, request);
    super(socket)
    Object.assign(this, request)
    this.body = this.body || {};
    this.data = this.data || {};
    this.files = this.files || {};
    this.Server = Server;
    // console.log(this.Server)
    this.parseUrl()
  }
  protected parseUrl () {
    let url = Url.parse(this.url, true)
    url.path = url.path
      .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
      .replace(/^(.+?)\/*?$/, '$1')
    url.href = url.href
      .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
      .replace(/^(.+?)\/*?$/, '$1')
    let pathname = url.pathname
      .trim()
      .replace(/(https?:\/\/)|(\/)+/g, '$1$2')
      .replace(/^(.+?)\/*?$/, '$1')
    this.pathname = pathname
    this.href = url.href
    this.method = this.method.toLowerCase()
    this.query = url.query || {}
    this.params = {}
    this.path = url.path
    this.parsedUrl = url
  }
  // accepts
  accepts () {
    let accept = accepts(this)
    return accept.types.apply(accept, arguments)
  }
  acceptsEncodings = function () {
    var accept = accepts(this)
    return accept.encodings.apply(accept, arguments)
  }
  acceptsCharsets = function () {
    var accept = accepts(this)
    return accept.charsets.apply(accept, arguments)
  }
  acceptsLanguages = function () {
    var accept = accepts(this)
    return accept.languages.apply(accept, arguments)
  }
  range (size: number, options: any) {
    var range: any = this.header('Range')
    if (!range) return
    return parseRange(size, range, options)
  }
  header (name: string) {
    if (!name) {
      throw new TypeError('name argument is required to req.get')
    }
    if (typeof name !== 'string') {
      throw new TypeError('name must be a string to req.get')
    }

    var lc = name.toLowerCase()

    switch (lc) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer
      default:
        return this.headers[lc]
    }
  }
  is(types:any[]) {
    var arr = types;
    if (!Array.isArray(types)) {
      arr = new Array(arguments.length);
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arguments[i];
      }
    }
    return typeis(this, arr);
  };
  xhr(){
    var val:any = this.header('X-Requested-With') || '';
    return val.toLowerCase() === 'xmlhttprequest';
  };
}
export default Request
