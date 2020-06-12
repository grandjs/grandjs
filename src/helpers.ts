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

// Dependencies
import fs from "fs";
import path from "path";
import crypto from "crypto";
import confg from "./config";
import { Duplex } from 'stream';
import Request from "./Request";
import Response from "./Response";
import querystring from "querystring";
import qs from "qs";
import proxyaddr from "proxy-addr";
import contentType from "content-type";
import { OptionalObject, NodeInterface } from "./interfaces/index";
import util from "util";
// end dependencies


// define helpers object
const helpers = {
  Cipher: {
    hash: function (string: string):string {
      if (typeof string === "string" && string.length > 0) {
        let hash = crypto.createHmac("sha256", "hashPassowrd").update(string).digest().toString("hex");
        return hash;
      } else {
        return "";
      }
    },
    enCrypt: function (text: string) {
      var IV_LENGTH = 16; // For AES, this is always 16
      var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
      let iv = crypto.randomBytes(IV_LENGTH);
      let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return iv.toString('hex') + ':' + encrypted.toString('hex');
    },
    deCrypt: function (text: string) {
      var IV_LENGTH = 16; // For AES, this is always 16
      var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
      let textParts = text.split(':');
      let iv = Buffer.from(textParts.shift(), 'hex');
      let encryptedText = Buffer.from(textParts.join(':'), 'hex');
      let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    }
  },
  parseCookies: function (request: Request) {
    var list: any = {},
      rc = request.headers.cookie;
    rc && rc.split(';').forEach(function (cookie) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
  },
  // render: function (options: any) {
  //   let data = options.data ? options.data : {};
  //   let layout = options.layout;
  //   let container = options.container || "views"
  //   let body: any = options.body ? fs.readFileSync(`${container}/${options.body}`, "utf8") : "<body></body>";
  //   body = handlebars.compile(body, { strict: false });
  //   body = body(data);
  //   data.body = body;
  //   let req = options.req;
  //   let res = options.res;
  //   let partials = options.partials ? options.partials : [];
  //   if (partials.length > 0) {
  //     partials.forEach(function (partial: any) {
  //       let partialName = path.basename(partial).split(".")[0];
  //       var partialFile = fs.readFileSync(`${container}/${partial}`, "utf8");
  //       handlebars.registerPartial(partialName, partialFile);
  //     })
  //   }
  //   // try {
  //   var htmlFile: any = fs.readFileSync(`${container}/${layout}`, "utf8");
  //   if (htmlFile) {
  //     htmlFile = handlebars.compile(htmlFile, { strict: false });
  //     htmlFile = htmlFile(data);
  //     res.end(htmlFile);
  //   }
  //   // } catch (e) {
  //   res.writeHead(200);
  //   res.end("");
  //   // }
  // },
  json: function (res: Response, data: object) {
    let result = JSON.stringify(data);
    res.end(result);
  },
  sendFile: function (req: Request, res: Response, file: any) {
    var mimeTypes: any = confg.mimeTypes;
    var fileSource = path.join(process.cwd(), file);
    fs.exists(fileSource, function (exist) {
      if (exist) {
        var headers = { "content-type": mimeTypes[path.extname(file)] };
        var fileStream = fs.createReadStream(fileSource);
        res.writeHead(200, headers);
        fileStream.pipe(res);
        return res;
      } else {
        throw new Error("file not found");
      }
    })
  },
  bufferToStream: function (buffer: any) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
  },
  warnings: {
    router: {
      called: false,
      text: "Grandjs Routers not will be working with just instantiating the router, you need to call `build()` method after instantiating the router to make it works"
    }
  },
   compileETag: function (val: any) {
    var fn;

    if (typeof val === 'function') {
      return val;
    }

    switch (val) {
      case true:
        fn = exports.wetag;
        break;
      case false:
        break;
      case 'strong':
        fn = exports.etag;
        break;
      case 'weak':
        fn = exports.wetag;
        break;
      default:
        throw new TypeError('unknown value for etag function: ' + val);
    }

    return fn;
  },
  compileQueryParser: function (val: any) {
    var fn;

    if (typeof val === 'function') {
      return val;
    }

    switch (val) {
      case true:
        fn = querystring.parse;
        break;
      case false:
        fn = helpers.newObject;
        break;
      case 'extended':
        fn = helpers.parseExtendedQueryString;
        break;
      case 'simple':
        fn = querystring.parse;
        break;
      default:
        throw new TypeError('unknown value for query parser function: ' + val);
    }
    return fn;
  },
  parseExtendedQueryString: function (str: string) {
    return qs.parse(str, {
      allowPrototypes: true
    });
  },
  newObject: function () {
    return {};
  },
  compileTrust: function (val: any) {
    if (typeof val === 'function') return val;

    if (val === true) {
      // Support plain true/false
      return function () { return true };
    }

    if (typeof val === 'number') {
      // Support trusting hop count
      return function (a: any, i: any) { return i < val };
    }

    if (typeof val === 'string') {
      // Support comma-separated values
      val = val.split(/ *, */);
    }

    return proxyaddr.compile(val || []);
  },
  setCharset(type: string, charset: any) {
    if (!type || !charset) {
      return type;
    }

    // parse type
    var parsed = contentType.parse(type);

    // set charset
    parsed.parameters.charset = charset;

    // format type
    return contentType.format(parsed);
  },
  validation: {
    strip_html_tags: function (str: string) {
      if ((str === null) || (str === ''))
        return false;
      else
        str = str.toString();
      return str.replace(/<[^>]*>/g, '');
    },
    // validate the email
    checkEmail: function (string: string, cb: Function) {
      var elementVal = string;
      elementVal = elementVal.trim();
      var regEx = new RegExp("@", "gi");
      if (elementVal !== "" || elementVal.length < 1) {
        if (cb) {
          var test = regEx.test(elementVal);
          return cb(test);
        } else {
          return regEx.test(elementVal);
        }
      }
    },
    notEmptyString: function (string: string, cb: Function) {
      let elementVal: string = string !== undefined ? string : "";
      elementVal = elementVal.trim();
      if (elementVal === "" || elementVal.length < 1) {
        if (!cb) {
          return false;
        }
        if (cb) {
          var empty = false;
          return cb(empty)
        }
      } else {
        if (cb) {
          return cb(elementVal);
        } else {
          return elementVal;
        }
      }
    },
    // method to check if the value is contains a number
    checkContainsNumber: function (string: string, count: number, cb: Function) {
      let elementVal = string.trim();
      if (typeof count === "function" && !cb) {
        cb = count;
      }
      count = typeof count === "number" ? count : 1;
      var numArr = [];
      if (elementVal !== "" || elementVal.length < 1) {
        Array.from(elementVal).forEach(function (letter) {
          if (Number.isInteger(Number(letter))) {
            numArr.push(letter);
          }
        });
        if (numArr.length === count) {
          let result = true;
          if (cb) {
            return cb(result);
          } else {
            return result;
          }
        } else {
          let result = false;
          if (cb) {
            return cb(result);
          } else {
            return result;
          }
        }
      }
    },
    // method to check if the input is Object
    isObject: function (obj: OptionalObject) {
      if (typeof obj == "object") {
        return obj;
      } else {
        return false;
      }
    },
    // method to check if the object is not empty
    notEmpty: function (obj: OptionalObject) {
      if (Object.keys(obj).length > 0) {
        return obj;
      } else {
        return false;
      }
    },
    // method to check if the input is string
    isString: function (str: string) {
      if (typeof str === "string") {
        return str;
      } else {
        return false;
      }
    },
    // method to check if the input is number
    checkIsNumber: function (element: string, cb: Function) {
      let elementVal = element;
      if (elementVal !== "") {
        var testNumber = Number.isInteger(Number(elementVal));
        if (cb) {
          return cb(testNumber);
        } else {
          return testNumber;
        }
      }
    }
  },
  async serveAssets(req: Request, res: Response, next: Function) {
    try {
      let staticFolder = this.staticFolder;
      if (staticFolder) {
        let sourceFolder = path.resolve("/", staticFolder.path);
        let pathname = req.pathname.split(staticFolder.url)[1];
        let mimeTypes: any = confg.mimeTypes
        let dirName = path.join("", `${sourceFolder}`);
        let fileSource;
        fileSource = path.join(staticFolder.path, pathname);
        fileSource = fileSource.split(path.sep).join("/");
        let promisifiedState = util.promisify(fs.lstat);
        let fileState = (await promisifiedState(fileSource));
        if (fileState.isFile()) {
          let fileStream = fs.createReadStream(fileSource);
          let extName: any = path.extname(pathname);
          let headers = {
            "Content-Type": mimeTypes[extName] || 'application/octet-stream',
            // 'Cache-Control': `public, max-age=${cacheControl || 'no-cache'}`,
            'Content-Length': fileState.size
          };
          res.writeHead(200, headers);
          return fileStream.pipe(res);
        } else {
  
          if(this.chooseHandler) {
            return this.chooseHandler.bind(this)(req, res);
          } else {
            res.statusCode = 404;
            return this.errorPage(req, res);
          }
        }
      } else {
        if(this.chooseHandler) {
          return this.chooseHandler.bind(this)(req, res);
        } else {
          res.statusCode = 404;
          return this.errorPage(req, res);
        }
      }
    } catch (err) {
      if(this.chooseHandler) {
        return this.chooseHandler.bind(this)(req, res);
      } else {
        res.statusCode = 404;
        return this.errorPage(req, res);
      }
    }

  }
};


export default helpers;
module.exports = helpers;

