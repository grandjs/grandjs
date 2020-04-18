"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importJsx = require("import-jsx");
const path_1 = __importDefault(require("path"));
const qs_1 = __importDefault(require("qs"));
class ViewClass {
    constructor() {
        this.settings = new Map();
        this.cache = new Map();
    }
    createElement(type, props, ...children) {
        let node = {
            type,
            props: Object.assign({}, props),
            children,
        };
        return node;
    }
    createTextElement(text) {
        let node = {
            type: "TEXT_ELEMENT",
            nodeValue: text,
            props: {},
            children: [],
        };
        return node;
    }
    convertCamelCaseToHyphen(name) {
        var uppercasePattern = /[A-Z]/g;
        var msPattern = /^ms-/;
        var cache = {};
        function toHyphenLower(match) {
            return '-' + match.toLowerCase();
        }
        if (cache.hasOwnProperty(name)) {
            return cache[name];
        }
        var hName = name.replace(uppercasePattern, toHyphenLower);
        return (cache[name] = msPattern.test(hName) ? '-' + hName : hName);
    }
    CamelCaseDeclarationToHyphen(property, value) {
        return this.convertCamelCaseToHyphen(property) + ':' + value;
    }
    convertObjectToCss(style) {
        let css = '';
        for (const property in style) {
            const value = style[property];
            if (typeof value !== 'string' && typeof value !== 'number') {
                continue;
            }
            if (css) {
                css += ';';
            }
            css += this.CamelCaseDeclarationToHyphen(property, value);
        }
        return css;
    }
    parser(node, data) {
        let type = node.type;
        let props = node.props;
        let children = node.children;
        let str = "";
        let attrs = this.parseAttributes(props);
        str += `<${type} ${attrs.attrs}>`;
        let parsedChildren = children.map((child) => {
            let parsedChild = this.parseChildren(child, data);
            if (parsedChild) {
                if (typeof parsedChild === "string") {
                    str += `${parsedChild}`;
                }
                else {
                    let element = this.parser(parsedChild, data);
                    str += `${element}`;
                }
            }
        });
        str += `</${type}>`;
        return str;
    }
    parseChildren(child, data) {
        if (typeof child === "string") {
            return child;
        }
        else if (child.type && typeof child.type === "function") {
            let component = child.type;
            let node = component(child.props);
            return node;
        }
        else {
            let result = this.parser(child, data);
            return result;
        }
    }
    parseAttributes(props) {
        let attributes = {};
        if (typeof props === "object") {
            Object.keys(props).map((key) => {
                let val = props[key];
                if (key === "style") {
                    let style = val;
                    if (typeof val === "object") {
                        style = this.convertObjectToCss(val);
                    }
                    val = style;
                }
                else if (key === "className") {
                    key = "class";
                    if (typeof val === "object") {
                        let values = Object.values(val).join(" ");
                        val = values;
                    }
                    else if (Array.isArray(val)) {
                        let values = val.join(" ");
                        val = values;
                    }
                }
                else if (typeof val == "object" || Array.isArray(val)) {
                    val = JSON.stringify(val);
                }
                attributes[key] = `"${val}"`;
            });
        }
        props = props || {};
        let attrs = qs_1.default.stringify(attributes, { encode: false, delimiter: " " });
        return { attributes, attrs };
    }
    render(res, Component, data) {
        let component = Component(data);
        let result = this.parser(component, data);
        res.writeHead(res.statusCode, { "content-type": "text/html" });
        return res.end(result);
    }
    importJsx(path) {
        let views = this.settings.get("views");
        path = path.replace(views, "");
        path = `.${path_1.default.join("/", views, path)}`;
        let foundFile = this.cache.get(path);
        if (!foundFile) {
            const importedFile = importJsx(path, { pragma: "View.createElement" || "this.createElement" });
            this.cache.set(path, importedFile);
            return importedFile;
        }
        else {
            return foundFile;
        }
    }
}
const View = new ViewClass();
exports.View = View;
module.exports = { View };
