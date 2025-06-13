import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

export function apiPrefixInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const backendRequest = req.clone({
        url: `${environment.apiUrl}${req.url}`
    })
    return next(backendRequest);
}