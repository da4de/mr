import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { StocksService } from "src/stocks/stocks.service";

/**
 * WebSocket Gateway to establish real-time communication between client and server
 */
@WebSocketGateway(3001)
export class WSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private stocksService: StocksService) { }

    handleConnection(client: WebSocket) {
        console.log('Client connected');
        client.addEventListener('message', this.handleMessage(client))
    }

    handleMessage = (client: WebSocket) => (event: MessageEvent) => {
        let data: any;
        try {
            data = JSON.parse(event.data);
        } catch {
            console.error('Invalid JSON from client')
            return
        }

        switch (data.type) {
            case 'subscribe':
                this.stocksService.subscribe(client, data.symbol)
                break;
            case 'unsubscribe':
                this.stocksService.unsubscribe(client, data.symbol)
                break;
            default:
                console.warn('Unknown message type, incomming data:', data);
        }
    }

    handleDisconnect(client: WebSocket) {
        console.log('Client disconnected');
        this.stocksService.unsubscribeAll(client);
    }
}

