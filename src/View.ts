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
import { OptionalObject, NodeInterface } from "./interfaces/index";
import helpers from "./helpers";
import Path from "path";
import qs from "qs";
import Response from "./Response";
import path from 'path';
import fs from 'fs';
class ViewClass {
  cache: Map<string, any>;
  settings: Map<string, any>;
  constructor() {
    this.settings = new Map();
    this.cache = new Map();
  }
  createElement(type: any, props: OptionalObject, ...children: any[]) {
    if (type === "style" && props && typeof props.src === "string") {
      children.push(props.src);
      delete props.src;
    }
    let node: NodeInterface = {
      type,
      props: {
        ...props,
      },
      children,
    };
    return node;
  }
  createTextElement(text: string) {
    let node: NodeInterface = {
      type: "TEXT_ELEMENT",
      nodeValue: text,
      props: {},
      children: [],
    };
    return node;
  }
  convertCamelCaseToHyphen(name: string) {
    var uppercasePattern = /[A-Z]/g;
    var msPattern = /^ms-/;
    var cache: OptionalObject = {};
    function toHyphenLower(match: string) {
      return "-" + match.toLowerCase();
    }
    if (cache.hasOwnProperty(name)) {
      return cache[name];
    }
    var hName = name.replace(uppercasePattern, toHyphenLower);
    return (cache[name] = msPattern.test(hName) ? "-" + hName : hName);
  }
  CamelCaseDeclarationToHyphen(property: string, value: string) {
    return this.convertCamelCaseToHyphen(property) + ":" + value;
  }
  convertObjectToCss(style: OptionalObject) {
    let css = "";
    for (const property in style) {
      const value: any = style[property];
      if (typeof value !== "string" && typeof value !== "number") {
        continue;
      }
      if (css) {
        css += ";";
      }
      css += this.CamelCaseDeclarationToHyphen(property, <any>value);
    }
    return css;
  }
  parser(node: NodeInterface, data: OptionalObject): any {
    let str = "";
    if (Array.isArray(node)) {
      Array.from(node).map((child) => {
        let elem = this.parseChildren(child, data);
        str += `${elem}`;
      });
      return str;
    } else if (
      node &&
      typeof node === "object" &&
      typeof node.type === "string"
    ) {
      let type = node.type;
      let props = node.props;
      let children = node.children || [];
      let attrs = this.parseAttributes(props, node);
      str += `<${type} ${attrs.attrs}>`;
      let parsedChildren = children.map((child) => {
        // console.log(child);
        let parsedChild = this.parseChildren(child, {
          ...data,
          ...props,
          children,
        });
        if (parsedChild) {
          if (typeof parsedChild === "string") {
            str += `${parsedChild}`;
          } else {
            let element = this.parser(parsedChild, data);
            str += `${element}`;
          }
        }
      });
      str += `</${type}>`;
      return str;
    } else if (typeof node === "string") {
      str += `${node}`;
      return str;
    } else if (
      node &&
      typeof node === "object" &&
      typeof node.type === "function"
    ) {
      let component = node.type({ ...node.props, children: node.children });
      let result = this.parser(component, node.props);
      return result;
    }
  }
  parseChildren(child: NodeInterface, data: OptionalObject) {
    if (typeof child === "string") {
      return child;
    } else if (child && child.type && typeof child.type === "function") {
      let component = child.type;
      let node = component({ ...child.props, children: child.children || [] });
      return this.parser(node, child.props);
    } else {
      let result = this.parser(child, data);
      return result;
    }
  }
  parseAttributes(props: OptionalObject, node: NodeInterface) {
    let attributes: OptionalObject = {};
    if (typeof props === "object") {
      Object.keys(props).map((key) => {
        let val = props[key];
        if (key === "style") {
          let style = val;
          if (typeof val === "object") {
            style = this.convertObjectToCss(val);
          }
          val = style;
        } else if (key === "className") {
          key = "class";
          if (typeof val === "object") {
            let values = Object.values(val).join(" ");
            val = values;
          } else if (Array.isArray(val)) {
            let values = val.join(" ");
            val = values;
          }
        }
        // else if(node.type === "style") {

        // }
        else if (typeof val == "object" || Array.isArray(val)) {
          val = JSON.stringify(val);
        }
      if(val !== false) {
          attributes[key] = `"${val}"`;
        }
      });
    }
    props = props || {};
    let attrs = qs.stringify(attributes, { encode: false, delimiter: " " });
    return { attributes, attrs };
  }
  render(res: Response, Component: Function, data: OptionalObject) {
    let component = Component(data);
    let result = this.parser(component, data);
    res.writeHead(res.statusCode, { "content-type": "text/html" });
    return res.end(result);
  }
  renderToHtml(Component: Function, data: OptionalObject) {
    let component = Component(data);
    let result = this.parser(component, data);
    return result;
  }
  importJsx(path: string) {
    const mainModulePath = process.mainModule.filename;
    let fileExtName = Path.extname(path);
    fileExtName = fileExtName.length > 0 ? fileExtName : null;
    // const fileExtension = fileExtName || this.settings.get('extension') || '.jsx';
    let parentPath:any = mainModulePath.split(Path.sep)
    parentPath = parentPath[parentPath.length - 2];
    let views = this.settings.get("views") || "";
    if (path.includes(views)) {
      path = path.split(views)[1];
    }
    let filePath = `${Path.join(process.cwd(), parentPath, views, path)}`;
    const filename = Path.basename(filePath);
    if (!fileExtName) {
      const files = fs.readdirSync(Path.dirname(filePath));
      const matchedFile = files.find((dirFilePath) => {
        const dirFileName = Path.basename(dirFilePath);
        const dirFileExtension = Path.extname(dirFileName);
        if ([".jsx", ".tsx"].includes(dirFileExtension)) {
          const fileNameWithExt = `${filename}${dirFileExtension}`;
          if (dirFileName === fileNameWithExt) {
            return true;
          }
        }
      })
      if (matchedFile) {
        const matchedFileExtension = Path.extname(matchedFile);
      filePath = `${filePath}${matchedFileExtension}`;
      }
    }
    let foundFile = this.cache.get(filePath);
    if (!foundFile) {
      const importedFile = importJsx(filePath, {
        pragma: "View.createElement" || "this.createElement",
      });
      this.cache.set(filePath, importedFile);
      return importedFile;
    } else {
      return foundFile;
    }
  }
  // method to parse sub style
  parseSubStyle(selectorName: string, subKey: string, style: OptionalObject) {
    let parsedStyle = this.convertObjectToCss(style);
    subKey = subKey.trim();
    subKey = subKey.replace("&", `.${selectorName}`);
    return `
        ${subKey} {
          ${parsedStyle}
        }
      `;
  }
  // create style methpd
  createStyle(object: { [key: string]: any }) {
    return () => {
      let styleString = ``;
      let keys: OptionalObject = {};
      Object.keys(object).map((key: string) => {
        let value = object[key];
        let subStyles: OptionalObject = {};
        Object.keys(value).map((key) => {
          if (typeof value[key] === "object") {
            subStyles[key] = value[key];
            delete value[key];
          }
        });
        let style = this.convertObjectToCss(value);
        let name = `${key}-${Math.random().toString().substr(4, 4)}`;
        if (Object.keys(subStyles).length > 0) {
          Object.keys(subStyles).map((subStyleKey) => {
            let subStyle = this.parseSubStyle(
              name,
              subStyleKey,
              subStyles[subStyleKey]
            );
            styleString += subStyle;
          });
        }
        keys[key] = name;
        styleString += `
            .${name} {
              ${style}
            }
          `;
      });
      return { ...keys, style: styleString };
    };
  }
}

const View = new ViewClass();

export { View };

module.exports = { View };
