import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { AlphabetComponent } from "./alphabet/alphabet.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterOutlet,
        RouterLink,
        AlphabetComponent,
        CommonModule
    ]
})
export class AppComponent {

    public get currentPath(): string {
        return window.location.pathname
    }
}
