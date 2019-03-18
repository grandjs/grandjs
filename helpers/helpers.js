/*
=========================================================
Grand js helper functions file

# Author Tarek Salem
=========================================================
*/

// Dependencies
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const crypto = require("crypto");

// end dependencies

global.root_dir = "../../";

// define helpers object
const helpers = {
    hash: function(string) {
        if (typeof string === "string" && string.length > 0) {
            let hash = crypto.createHmac("sha256", "hashPassowrd").update(string).digest();
            return hash;
        } else {
            return false;
        }
    }
};
// function to hash passwords

// validation method to validate body data of request
helpers.validation = {};

// remove strip tags
helpers.validation.strip_html_tags = function(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    }
    // validate the email
helpers.validation.checkEmail = function(string, cb) {
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
}
helpers.validation.notEmpty = function(string, cb) {
        elementVal = string !== undefined ? string : "";
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
                var empty = true;
                return cb(empty);
            } else {
                return true;
            }
        }
    }
    // method to check if the value is contains a number
helpers.validation.checkContainsNumber = function(string, count, cb) {
    var elementVal = string.trim();
    if (typeof count === "function" && !cb) {
        cb = count;
    }
    count = typeof count === "number" ? count : 1;
    var numArr = [];
    if (elementVal !== "" || elementVal.length < 1) {
        Array.from(elementVal).forEach(function(letter) {
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
}
helpers.validation.checkIsNumber = function(element, cb) {
        var elementVal = element;
        if (elementVal !== "") {
            var testNumber = Number.isInteger(Number(elementVal));
            if (cb) {
                return cb(testNumber);
            } else {
                return testNumber;
            }
        }
    }
    // function to crypt strings
    // Must be 256 bytes (32 characters)

helpers.enCrypt = function(text) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    // const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY = "ncryptiontestforencryptionproces";
helpers.deCrypt = function(text) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
        let textParts = text.split(':');
        let iv = new Buffer(textParts.shift(), 'hex');
        let encryptedText = new Buffer(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    // function to parse cookies
helpers.parseCookies = function(request) {
    var list = {},
        rc = request.headers.cookie;
    rc && rc.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}
helpers.render = function(options) {
    let data = options.data ? options.data : {};
    let layout = options.layout;
    let container = options.container || "views"
    let body = options.body ? fs.readFileSync(`${container}/${options.body}`, "utf8") : "<body></body>";
    body = handlebars.compile(body, { strict: true });
    body = body(data);
    data.body = body;
    let req = options.req;
    let res = options.res;
    let partials = options.partials ? options.partials : [];
    if (partials.length > 0) {
        partials.forEach(function(partial) {
            let partialName = path.basename(partial).split(".")[0];
            var partialFile = fs.readFileSync(`${container}/${partial}`, "utf8");
            handlebars.registerPartial(partialName, partialFile);
        })
    }
    // try {
    var htmlFile = fs.readFileSync(`${container}/${layout}`, "utf8");
    if (htmlFile) {
        htmlFile = handlebars.compile(htmlFile, { strict: true });
        htmlFile = htmlFile(data);
        res.end(htmlFile);
    }
    // } catch (e) {
    res.writeHead(200);
    res.end("");
    // }
}
helpers.json = function(res, data) {
    data = JSON.stringify(data);
    res.end(data);
}
helpers.sendFile = function(req, res, file, cb) {
    var mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/js",
        ".png": "image/png",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".json": "application/json",
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".flv": "video/x-flv",
        ".m3u8": "application/x-mpegURL",
        ".ts": "video/MP2T",
        ".3gp": "video/3gpp",
        ".mov": "video/quicktime",
        ".avi": "video/x-msvideo",
        ".wmv": "video/x-ms-wmv",
        ".ogg": "audio/ogg",
        ".ogv": "video/ogg",
        ".opus": "audio/ogg",
        ".svg": "image/svg+xml",
        ".svgz": "image/svg+xml"
    };
    var fileSource = path.join(process.cwd(), file);
    fs.exists(fileSource, function(exist) {
        if (exist) {
            var headers = { "content-type": mimeTypes[path.extname(file)] };
            var fileStream = fs.createReadStream(fileSource);
            res.writeHead(200, headers);
            fileStream.pipe(res);
            return cb(true);
        } else {
            return cb(false)
        }
    })
}
helpers.staticFiles = function(req, res, pathname, staticFolder, typeReq, cacheControl) {
    var sourceFolder = staticFolder;
    var mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/js",
        ".png": "image/png",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".json": "application/json",
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".flv": "video/x-flv",
        ".m3u8": "application/x-mpegURL",
        ".ts": "video/MP2T",
        ".3gp": "video/3gpp",
        ".mov": "video/quicktime",
        ".avi": "video/x-msvideo",
        ".wmv": "video/x-ms-wmv",
        ".ogg": "audio/ogg",
        ".ogv": "video/ogg",
        ".opus": "audio/ogg",
        ".svg": "image/svg+xml",
        ".svgz": "image/svg+xml"
    };
    var dirName = path.join("", `${sourceFolder}`);
    var fileSource = path.join(dirName, pathname);
    var existFile = fs.existsSync(fileSource);
    return new Promise((resolve, reject) => {
        if (existFile) {
            try {
                var fileStream = fs.createReadStream(fileSource);
                let fileState = fs.statSync(fileSource);
                var headers = {
                    "Content-Type": mimeTypes[path.extname(pathname)] || 'application/octet-stream',
                    'Cache-Control': `public, max-age=${cacheControl || 24*60*60}`,
                    'Content-Length': fileState.size
                };
                res.writeHead(302, headers);
                fileStream.pipe(res);
                return resolve();
            } catch (e) {
                res.statusCode = 404;
                return false;
            }
        } else {
            res.statusCode = 404;
            return reject(fileSource);
        }
    })
}


module.exports = helpers;