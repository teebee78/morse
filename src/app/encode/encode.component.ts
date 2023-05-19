import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable, concatMap, endWith, filter, from, fromEvent, map, scan, startWith, switchMap } from 'rxjs';
import { delayEach } from '../delay-each';
import { SignalComponent } from '../signal/signal.component';
import { BinarySignal, CHAR_END, DOT_DURATION_IN_MS, Letter, MORSE_ALPHABET, MorseSignal } from '../morse-alphabet';

@Component({
  selector: 'app-morse',
  standalone: true,
  imports: [CommonModule, SignalComponent],
  templateUrl: './encode.component.html',
  styleUrls: ['./encode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncodeComponent {

  public signal$: Observable<0 | 1>;
  public typedText$: Observable<string>;

  constructor(@Inject(MORSE_ALPHABET) alphabet: Map<Letter, MorseSignal[]>,
    @Inject(DOT_DURATION_IN_MS) private dotTimeInMs: number) {

    const keyDownEvents$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter(event => event.key.length == 1)
    );

    const escapePressed$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      filter(({ key }) => key === 'Escape'),
      map(() => undefined),
    );

    this.typedText$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(() => keyDownEvents$.pipe(
        scan((acc, { key }) => acc + key, ''),
        startWith('')
      )),
    );

    //.subscribe(event => console.log('event', event))

    // this.typedText$ = keyDownEvents$.pipe(
    //   scan((acc, { key }) => acc + key, '')
    // );



    /*
    - dash: three 1s in a row
    - dot: sigle 1
    - separated by a single 0
    - letters are separated by three 0s
    - words are separated by sev;en 0s (four 0's = space + three 0s of char end)
    */
    this.signal$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(() => keyDownEvents$.pipe(
          map(({ key }) => alphabet.get(key as Letter)),
          filter(Boolean),
          map(morseSignals => morseSignals
            .map(each => (each === '·' ? [1] : [1, 1, 1]) as (0 | 1)[])
            .reduce((prev, curr) => (prev.length > 0) ? [...prev, 0, ...curr] : curr, [])
          ),
          concatMap(sequence => from(sequence).pipe(
            endWith(...CHAR_END),
          )),
          delayEach(2 * dotTimeInMs),
          startWith(0 as BinarySignal),
        )
      )
    );
  }
}
