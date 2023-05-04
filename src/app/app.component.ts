import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AlphabetComponent } from "./alphabet/alphabet.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        AlphabetComponent
    ]
})
export class AppComponent {
  
}
