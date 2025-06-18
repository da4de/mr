import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { StocksService } from "src/stocks/stocks.service";

@WebSocketGateway(8080)
export class WSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private stocksService: StocksService) { }

    handleConnection(client: WebSocket) {
        console.log('Client connected');
        client.addEventListener('message', this.handleMessage(client))
    }

    handleMessage = (client: WebSocket) => (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
            case 'subscribe':
                this.stocksService.subscribe(client, data.symbol)
                break;
            case 'unsubscribe':
                this.stocksService.unsubscribe(client, data.symbol)
                break;
        }
    }

    handleDisconnect(client: WebSocket) {
        console.log('Client disconnected');
        this.stocksService.unsubscribeAll(client);
    }
}