import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../../environments/environment";
import { Observable, Subject, timer } from "rxjs";

/**
 * Service for managing WebSocket connection
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService {
    /** Subject that communicates with the server via WebSocket */
    private socket$: WebSocketSubject<any> | null = null;

    private connected$ = new Subject<void>();
    private messages$ = new Subject<any>()

    private isReconnecting = false;

    constructor() {
        this.connect()
    }

    /** Opening connection with Server through WebSocket */
    private connect() {
        console.log('Opening connection with Server through WebSocket')

        try {
            this.socket$ = webSocket({
                url: environment.wsUrl,
                openObserver: {
                    next: () => {
                        console.log('Client connected with Server throught WebSocket');
                        this.connected$.next();
                    }
                },

            });
        } finally {
            this.isReconnecting = false;
        }

        this.socket$.subscribe({
            next: message => this.messages$.next(message),
            error: (error) => {
                if (error?.type === 'close') {
                    console.warn('Close event received from Server');
                } else {
                    console.error('WebSocket error:', error);
                }
                console.warn('Connection will be recreated')
                this.reconnect();
            }
        });
    }

    /** Reopening connection to the WebSocket server */
    private reconnect() {
        if (this.isReconnecting) {
            console.warn('Reopening connection is already in progress')
            return;
        }
        this.isReconnecting = true;

        this.closeConnection();
        timer(5000).subscribe(() => {
            this.connect();
        })
    }

    /**
     * Sends a message to the server through the WebSocket connection
     * @param message The message to send
     */
    sendMessage(message: any) {
        if (this.socket$) {
            this.socket$.next(message);
        } else {
            console.error('WebSocket is not ready yet.')
        }

    }

    onConnected(): Observable<void> {
        return this.connected$.asObservable();
    }

    /**
     * Returns an observable that emits messages received from the server
     * @returns Observable of incoming messages
     */
    getMessage(): Observable<any> {
        return this.messages$.asObservable();
    }

    /**
     * Closes the WebSocket connection
     */
    closeConnection() {
        if (this.socket$) {
            this.socket$.complete()
        }
    }
}
