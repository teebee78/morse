import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { AlphabetComponent } from "./alphabet/alphabet.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        AlphabetComponent,
        CommonModule
    ]
})
export class AppComponent {

    constructor(public route: ActivatedRoute) {
    console.log('y', route.snapshot, window.location.pathname)
    }

    public get currentPath(): string {
        return window.location.pathname
    }
}
