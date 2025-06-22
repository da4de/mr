import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { environment } from "../../../environments/environment";

/**
 * HTTP interceptor that adds the backend API URL to all relative requests
 * @param req The outgoing HTTP request
 * @param next The next interceptor handler in chain
 * @returns The observable resulting from the HTTP request
 */
export function apiPrefixInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    /* Skip absolute URLs */
    if (/^https?:\/\//i.test(req.url)) {
        return next(req);
    }

    const backendRequest = req.clone({
        url: `${environment.apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
    })
    return next(backendRequest);
}