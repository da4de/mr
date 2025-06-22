import { Component, OnDestroy, OnInit } from "@angular/core";
import { StatusService } from "./market-status.service";
import { MarketStatus } from "./market-status.model";
import { NgIf } from "@angular/common";
import { Subscription } from "rxjs";

/**
 * Component responsible for displaying the current market status,
 * including holidays and trading sessions when applicable
 */
@Component({
    selector: 'market-status',
    templateUrl: 'market-status.component.html',
    imports: [NgIf],
})
export class MarketStatusComponent implements OnInit, OnDestroy {
    /** Current market status */
    status: MarketStatus = { isOpen: false, holiday: '', session: '' }

    constructor(private statusService: StatusService) { }

    /** Subscription collector */
    private subscription = new Subscription();

    ngOnInit() {
        this.subscription.add(
            this.statusService.getMarketStatus().subscribe(status => {
                this.status = status;
            })
        )
    }

    /**
     * Handler for the "Simulate" button click.
     */
    onSimulationClick() {
        this.subscription.add(
            this.statusService.generation().subscribe()
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}