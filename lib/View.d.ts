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
    parser(node: NodeInterface, data: OptionalObject): string;
    parseChildren(child: NodeInterface, data: OptionalObject): any;
    parseAttributes(props: OptionalObject): {
        attributes: OptionalObject;
        attrs: string;
    };
    render(res: Response, Component: Function, data: OptionalObject): void;
    importJsx(path: string): any;
}
declare const View: ViewClass;
export { View };
