import { Component } from "@angular/core";
import { SearchService } from "../../../services/search.service";
import { Observable } from "rxjs";
import { Ticker } from "../search-ticker/search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../../services/favorites.service";
import { PrimeIcons } from "primeng/api";
import { Action } from "../../../common/components/actions/actions.model";

@Component({
    selector: 'search-result',
    templateUrl: 'search-result.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class SearchResult {
    actions: Action[] = [{
        icon: PrimeIcons.STAR,
        onAction: (item: Ticker) => {
            if (this.favoriteService.isFavorite(item.symbol)) {
                this.favoriteService.deleteFavorite(item.symbol)
            } else {
                this.favoriteService.addFavorite(item)
            }
            
        },
        outlined: (item: Ticker) => 
            !this.favoriteService.isFavorite(item.symbol)
    }]

    constructor(private searchService: SearchService, private favoriteService: FavoriteService) { }

    get searchResults$() {
        return this.searchService.searchResults$;
    }
}