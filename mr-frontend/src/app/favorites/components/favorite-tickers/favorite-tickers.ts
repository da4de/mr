import { Component } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Ticker } from "../../../search/components/search-ticker/search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../favorites.service";
import { WebSocketService } from "../../../websocket/websocket.service";

@Component({
    selector: 'favorite-tickers',
    templateUrl: 'favorite-tickers.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class FavoriteTickers {
    favorites$!: Observable<Ticker[]>;
    private messageSubscription!: Subscription;

    actions = [
        {
            icon: 'pi pi-chart-line',
            action: (item: Ticker) => {
                console.log('add to chart 1');
                this.webSocketService.sendMessage({ type: 'subscribe', symbol: item.symbol });
                console.log('add to chart 2');
            }
        },
        {
            icon: 'pi pi-trash',
            action: (item: Ticker) => {
                this.favoriteService.delete(item.symbol);
            }
        }];

    constructor(private favoriteService: FavoriteService, private webSocketService: WebSocketService) { }

    ngOnInit() {
        this.favorites$ = this.favoriteService.favorites$

        // Subscribe to messages from the WebSocket
        this.messageSubscription = this.webSocketService.getMessage().subscribe(
            (message) => {
                console.log('ws message to client', message)
            }
        );
    }
}