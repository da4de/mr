import { Component } from "@angular/core";
import { SearchService } from "../../search.service";
import { Observable } from "rxjs";
import { SearchTickerResult } from "../search-ticker/search.model";
import { AsyncPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";

@Component({
    selector: 'search-result',
    templateUrl: 'search-result.html',
    imports: [NgIf, AsyncPipe, TickerList],
    styleUrl: './search-result.css'
})
export class SearchResult {
    searchResults$!: Observable<SearchTickerResult[]>;

    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.searchResults$ = this.searchService.getSearchResults()
    }
}