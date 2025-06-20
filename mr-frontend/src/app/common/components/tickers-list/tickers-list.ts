import { Component, Input } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { Ticker } from "../../../search/components/search-ticker/search.model";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { DataViewModule } from "primeng/dataview";
import { Actions } from "../actions/actions";
import { Action } from "../actions/actions.model";

@Component({
    selector: 'tickers-list',
    templateUrl: 'tickers-list.html',
    imports: [NgFor, NgIf, NgClass, DataViewModule, ButtonModule, Actions]
})
export class TickerList {
    @Input()
    tickers: Ticker[] = [];
    @Input()
    emptyMessage: string = '';
    @Input()
    actions: Action[] = []
}
