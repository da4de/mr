import { Component, Input } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { Action } from "./actions.model";
import { NgFor } from "@angular/common";

/**
 * Component to display a list of actions for a given item.
 * Each action is rendered as a button.
 */
@Component({
    selector: 'actions',
    templateUrl: 'actions.component.html',
    imports: [ButtonModule, NgFor]
})
export class ActionsComponent {
    /** List of actions to display */
    @Input() actions: Action[] = []

    /** Item associated with the actions */
    @Input() item: unknown;
}