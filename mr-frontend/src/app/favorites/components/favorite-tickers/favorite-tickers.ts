import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Ticker } from "../../../search/components/search-ticker/search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../favorites.service";

@Component({
    selector: 'favorite-tickers',
    templateUrl: 'favorite-tickers.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class FavoriteTickers {
    favorites$!: Observable<Ticker[]>;

    actions = [
        {
            icon: 'pi pi-chart-line',
            action: (item: Ticker) => {
                console.log('add to chart')
            }
        },
        {
            icon: 'pi pi-trash',
            action: (item: Ticker) => {
                this.favoriteService.delete(item.symbol);
            }
        }];

    constructor(private favoriteService: FavoriteService) { }

    ngOnInit() {
        this.favorites$ = this.favoriteService.favorites$
    }
}