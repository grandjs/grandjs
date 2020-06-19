import { OptionalObject, NodeInterface } from './interfaces/index';
import Response from "./Response";
declare class ViewClass {
    cache: Map<string, any>;
    settings: Map<string, any>;
    constructor();
    createElement(type: any, props: OptionalObject, ...children: any[]): NodeInterface;
    createTextElement(text: string): NodeInterface;
    convertCamelCaseToHyphen(name: string): any;
    CamelCaseDeclarationToHyphen(property: string, value: string): string;
    convertObjectToCss(style: OptionalObject): string;
    parser(node: NodeInterface, data: OptionalObject): any;
    parseChildren(child: NodeInterface, data: OptionalObject): any;
    parseAttributes(props: OptionalObject, node: NodeInterface): {
        attributes: OptionalObject;
        attrs: string;
    };
    render(res: Response, Component: Function, data: OptionalObject): void;
    renderToHtml(Component: Function, data: OptionalObject): any;
    importJsx(path: string): any;
    parseSubStyle(selectorName: string, subKey: string, style: OptionalObject): string;
    createStyle(object: {
        [key: string]: any;
    }): () => {
        style: string;
    };
}
declare const View: ViewClass;
export { View };
