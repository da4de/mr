import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'search-ticker',
    templateUrl: 'search-ticker.html',
    imports: [ButtonModule, InputTextModule]
})
export class SearchTicker {
    search: string = ''
    onclick = async () => {
        
        
    }
}