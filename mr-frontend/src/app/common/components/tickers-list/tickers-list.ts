import { Component, Input } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { Ticker } from "../../../search/components/search-ticker/search.model";
import { AsyncPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { DataViewModule } from "primeng/dataview";

@Component({
    selector: 'tickers-list',
    templateUrl: 'tickers-list.html',
    imports: [NgFor, NgClass, DataViewModule, ButtonModule]
})
export class TickerList {
    @Input()
    tickers: Ticker[] = [];
    @Input()
    emptyMessage: string = '';
}
