import { Component } from "@angular/core";
import { StatusService } from "../services/market-status.service";
import { IMarketStatus } from "./status.model";
import { NgIf } from "@angular/common";


@Component({
    selector: 'market-status',
    templateUrl: 'status.html',
    imports: [NgIf],
})
export class MarketStatus {
    status: IMarketStatus = {isOpen: false, holiday: ''}
    constructor(private statusService: StatusService) { }

    ngOnInit() {
        this.statusService.getMarketStatus().subscribe(status => {
            this.status = status;
        })
    }

    onSimulationClick() {
        this.statusService.generation().subscribe();
    }
}