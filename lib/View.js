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
 * File Role: View JSX Template Parser
 * ==============================================================================
 */
const importJsx = require("import-jsx");
const path_1 = __importDefault(require("path"));
const qs_1 = __importDefault(require("qs"));
class ViewClass {
    constructor() {
        this.settings = new Map();
        this.cache = new Map();
    }
    createElement(type, props, ...children) {
        if (type === "style" && props && typeof props.src === "string") {
            children.push(props.src);
            delete props.src;
        }
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
        let str = "";
        if (Array.isArray(node)) {
            Array.from(node).map((child) => {
                let elem = this.parseChildren(child, data);
                str += `${elem}`;
            });
            return str;
        }
        else if (typeof node === "object" && typeof node.type === "string") {
            let type = node.type;
            let props = node.props;
            let children = node.children || [];
            let attrs = this.parseAttributes(props, node);
            str += `<${type} ${attrs.attrs}>`;
            let parsedChildren = children.map((child) => {
                // console.log(child);
                let parsedChild = this.parseChildren(child, Object.assign(Object.assign(Object.assign({}, data), props), { children }));
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
        else if (typeof node === "string") {
            str += `${node}`;
            return str;
        }
        else if (typeof node === "object" && typeof node.type === "function") {
            let component = node.type(Object.assign(Object.assign({}, node.props), { children: node.children }));
            let result = this.parser(component, node.props);
            return result;
        }
    }
    parseChildren(child, data) {
        if (typeof child === "string") {
            return child;
        }
        else if (child && child.type && typeof child.type === "function") {
            let component = child.type;
            let node = component(Object.assign(Object.assign({}, child.props), { children: child.children || [] }));
            return this.parser(node, child.props);
        }
        else {
            let result = this.parser(child, data);
            return result;
        }
    }
    parseAttributes(props, node) {
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
                // else if(node.type === "style") {
                // }
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
    renderToHtml(Component, data) {
        let component = Component(data);
        let result = this.parser(component, data);
        return result;
    }
    importJsx(path) {
        let views = this.settings.get("views") || "";
        path = path.replace(views, "");
        path = path_1.default.join("/", views, path);
        path = `${path_1.default.join(process.cwd(), path)}`;
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
    // create style methpd
    createStyle(object) {
        return () => {
            let styleString = ``;
            let keys = {};
            Object.keys(object).map((key) => {
                let value = object[key];
                let style = this.convertObjectToCss(value);
                let name = `${key}-${Math.random().toString().substr(4, 4)}`;
                keys[key] = name;
                styleString += `
            .${name} {
              ${style}
            }
          `;
            });
            return Object.assign(Object.assign({}, keys), { style: styleString });
        };
    }
}
const View = new ViewClass();
exports.View = View;
module.exports = { View };
