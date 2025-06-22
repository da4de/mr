import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private socket$: WebSocketSubject<any>;

    constructor() {
        this.socket$ = webSocket(environment.wsUrl);
    }

    sendMessage(message: any) {
        this.socket$.next(message);
    }

    getMessage(): Observable<any> {
        return this.socket$.asObservable();
    }

    closeConnection() {
        this.socket$.complete()
    }
}
