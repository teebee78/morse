import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Letter, MORSE_ALPHABET, MorseSignal } from '../morse-alphabet';

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.scss']
})
export class AlphabetComponent {

  constructor(@Inject(MORSE_ALPHABET) public alphabet: Map<Letter, MorseSignal[]>) {
    
  }

}
