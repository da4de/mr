import { Component, Input } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { Ticker } from "../../../search/components/search-ticker/search.model";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { DataViewModule } from "primeng/dataview";

@Component({
    selector: 'tickers-list',
    templateUrl: 'tickers-list.html',
    imports: [NgFor, NgIf, NgClass, DataViewModule, ButtonModule]
})
export class TickerList {
    @Input()
    tickers: Ticker[] = [];
    @Input()
    emptyMessage: string = '';
    @Input()
    actionIcon: string = 'pi pi-star'
    @Input()
    onAction: (item: Ticker) => void = () => {};
    @Input()
    actions: {icon: string, action: (item: Ticker) => void, outlined?: (item: Ticker) => boolean}[] = []
}
