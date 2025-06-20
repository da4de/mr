import { Component, Input } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { Action } from "./actions.model";
import { NgFor } from "@angular/common";

@Component({
    selector: 'actions',
    templateUrl: 'actions.html',
    imports: [ButtonModule, NgFor]
})
export class Actions {
    @Input()
    actions: Action[] = []
    @Input()
    item: any;
}