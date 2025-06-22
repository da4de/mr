import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

/**
 * Service for managing WebSocket connection
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService {
    /** Subject that communicates with the server via WebSocket */
    private socket$: WebSocketSubject<any>;

    constructor() {
        this.socket$ = webSocket(environment.wsUrl);
    }

    /**
     * Sends a message to the server through the WebSocket connection
     * @param message The message to send
     */
    sendMessage(message: any) {
        this.socket$.next(message);
    }

    /**
     * Returns an observable that emits messages received from the server
     * @returns Observable of incoming messages
     */
    getMessage(): Observable<any> {
        return this.socket$.asObservable();
    }

    /**
     * Closes the WebSocket connection
     */
    closeConnection() {
        this.socket$.complete()
    }
}
