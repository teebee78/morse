import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Letter, MORSE_ALPHABET, MorseSignal } from '../morse-alphabet';

@Component({
    selector: 'app-alphabet',
    imports: [CommonModule],
    templateUrl: './alphabet.component.html',
    styleUrls: ['./alphabet.component.scss']
})
export class AlphabetComponent {

  constructor(@Inject(MORSE_ALPHABET) public alphabet: Map<Letter, MorseSignal[]>) {
    
  }

  public compareFn = ({ key: a}: {key: Letter}, { key: b}: {key: Letter}): number =>  {
    if (isNumeric(a) && isNumeric(b)) {
      return +a - +b;
    }
    if (isNumeric(a) && !isNumeric(b)) {
      return -1;
    }
    if (!isNumeric(a) && isNumeric(b)) {
      return -1;
    }
    return a.localeCompare(b)
  }
}

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}
