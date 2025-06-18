import { Component } from "@angular/core";
import { SearchService } from "../../search.service";
import { Observable } from "rxjs";
import { Ticker } from "../search-ticker/search.model";
import { AsyncPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../../favorites/favorites.service";

@Component({
    selector: 'search-result',
    templateUrl: 'search-result.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class SearchResult {
    searchResults$!: Observable<Ticker[]>;

    actions = [{
        icon: "pi pi-star",
        action: (item: Ticker) => {
            if (this.favoriteService.isFavorite(item.symbol)) {
                this.favoriteService.delete(item.symbol)
            } else {
                this.favoriteService.add(item)
            }
            
        },
        outlined: (item: Ticker) => 
            !this.favoriteService.isFavorite(item.symbol)
    }]

    constructor(private searchService: SearchService, private favoriteService: FavoriteService) { }

    ngOnInit() {
        this.searchResults$ = this.searchService.getSearchResults()
    }
}