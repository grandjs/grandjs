import Request from "./Request";
import Response from "./Response";
import Route from "./Route";
declare class RequestParser {
    req: Request;
    res: Response;
    supportedTypes: {
        [key: string]: Function;
    };
    constructor(req: Request, res: Response);
    handler(matchedRoute: Route, req: Request, res: Response): any;
    parseFormUrlEncode(matchedRoute: Route, req: Request, res: Response): Request;
    parseFormData(matchedRoute: Route, req: Request, res: Response): void;
    parseText(matchedRoute: Route, req: Request, res: Response): Request;
    parseJson(matchedRoute: Route, req: Request, res: Response): Request;
}
export default RequestParser;
