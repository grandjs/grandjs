const importJsx = require("import-jsx");
import { OptionalObject, NodeInterface } from './interfaces/index';
import helpers from "./helpers";
import Path from "path";
import qs from "qs";
import Response from "./Response";
class ViewClass {
    cache: Map<string, any>;
    settings: Map<string, any>
    constructor() {
        this.settings = new Map();
        this.cache = new Map();
    }
    createElement(type:any, props:OptionalObject, ...children:any[]) {
        let node:NodeInterface = {
          type,
          props: {
            ...props,
          },
          children,
        }
        return node;
      }
      createTextElement(text:string) {
        let node:NodeInterface = {
          type: "TEXT_ELEMENT",
          nodeValue: text,
          props: {
          },
          children: [],
        }
        return node;
      }
      convertCamelCaseToHyphen(name:string) {
        var uppercasePattern = /[A-Z]/g
        var msPattern = /^ms-/
        var cache:OptionalObject = {}
      function toHyphenLower(match:string) {
        return '-' + match.toLowerCase()
      }
      if (cache.hasOwnProperty(name)) {
        return cache[name]
      }
      var hName = name.replace(uppercasePattern, toHyphenLower)
      return (cache[name] = msPattern.test(hName) ? '-' + hName : hName)
    }
    CamelCaseDeclarationToHyphen(property:string, value:string) {
      return this.convertCamelCaseToHyphen(property) + ':' + value
    }
    convertObjectToCss(style:OptionalObject) {
      let css = ''
      for (const property in style) {
        const value:any = style[property]
        if (typeof value !== 'string' && typeof value !== 'number') {
          continue
        }
        if (css) {
          css += ';'
        }
        css += this.CamelCaseDeclarationToHyphen(property, <any>value)
      }
      return css
    }
    parser(node:NodeInterface, data:OptionalObject) {
        let type = node.type;
        let props = node.props;
        let children = node.children;
        let str = "";
        let attrs = this.parseAttributes(props);
        str+=`<${type} ${attrs.attrs}>`;
        let parsedChildren = children.map((child) => {
          let parsedChild  = this.parseChildren(child, data)
          if(parsedChild) {
            if(typeof parsedChild === "string") {
              str+=`${parsedChild}`
            } else {
              let element = this.parser(parsedChild, data);
              str+=`${element}`
            }
          }
        });
        str+=`</${type}>`
        return str;
      }
      parseChildren(child:NodeInterface, data:OptionalObject) {
        if(typeof child === "string") {
          return child;
        } else if(child.type && typeof child.type === "function") {
          let component = child.type;
          let node = component(child.props);
            return node;
        } else {
          let result = this.parser(child, data)
          return result;
        }
      }
       parseAttributes (props:OptionalObject) {
        let attributes:OptionalObject = {};
        if(typeof props === "object") {
          Object.keys(props).map((key) => {
            let val = props[key];
            if(key === "style") {
              let style = val;
              if(typeof val === "object") {
                style = this.convertObjectToCss(val);
              }
              val = style;
            } else if(key === "className") {
                key = "class";
                if(typeof val === "object") {
                    let values = Object.values(val).join(" ");
                    val = values;
                } else if(Array.isArray(val)) {
                    let values = val.join(" ");
                    val = values;
                }
            }
             else if(typeof val == "object" || Array.isArray(val)) {
              val = JSON.stringify(val);
            }
            attributes[key] = `"${val}"`;
          })
        }
        props = props || {};
        let attrs = qs.stringify(attributes, {encode: false, delimiter: " "})
        return {attributes, attrs};
    }
    render(res:Response, Component:Function, data:OptionalObject) {
          let component = Component(data);
          let result = this.parser(component, data);
          res.writeHead(res.statusCode, { "content-type": "text/html"});
          return res.end(result);
    }
    importJsx(path:string) {
        let views = this.settings.get("views");
        path = path.replace(views, "")
        path = `.${Path.join("/", views, path)}`
        let foundFile = this.cache.get(path);
        if(!foundFile) {
            const importedFile =  importJsx(path, {pragma: "View.createElement" || "this.createElement"})
            this.cache.set(path, importedFile);
            return importedFile;
        } else {
            return foundFile;
        }

    }
}


const View = new ViewClass();
export {View};

module.exports = {View};