import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Observable, concatMap, endWith, filter, from, fromEvent, map, scan, tap } from 'rxjs';
import { debug } from '../debug-operator';
import { delayEach } from '../delay-each';
import { CHAR_END, MAP } from '../morse';
import { SignalComponent } from '../signal/signal.component';
import { DOT_DURATION_IN_MS, Letter, MORSE_ALPHABET, MorseSignal } from '../morse-alphabet';

@Component({
  selector: 'app-morse',
  standalone: true,
  imports: [CommonModule, SignalComponent],
  templateUrl: './encode.component.html',
  styleUrls: ['./encode.component.scss'],
})
export class EncodeComponent {

  public signal$: Observable<0 | 1>;
  public typedText$: Observable<string>;

  constructor(@Inject(MORSE_ALPHABET) alphabet: Map<Letter, MorseSignal[]>,
              @Inject(DOT_DURATION_IN_MS) private dotTimeInMs: number)   {
    const keyDownEvents$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter(event => event.key.length == 1)
    );

    this.typedText$ = keyDownEvents$.pipe(
      scan((acc, { key }) => acc + key, '')
    );

    /*
    - dash: three 1s in a row
    - dot: sigle 1
    - separated by a single 0
    - letters are separated by three 0s
    - words are separated by seven 0s (four 0's = space + three 0s of char end)
    */
    this.signal$ = keyDownEvents$.pipe(
      map(({ key }) => alphabet.get(key as Letter)),
      filter(Boolean),
      map(morseSignals => morseSignals
        .map(each => (each === '.' ? [1] : [1, 1, 1]) as (0 | 1)[])
        .reduce((prev, curr) => (prev.length > 0) ? [...prev, 0, ...curr] : curr, [])
      ),
      concatMap(sequence => from(sequence).pipe(
        endWith(...CHAR_END),
      )),
      delayEach(2 * dotTimeInMs),
    );
  }
}
