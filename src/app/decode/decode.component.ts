import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Observable, Subject, distinctUntilKeyChanged, filter, fromEvent, map, merge, of, pairwise, scan, startWith, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Letter, MORSE_ALPHABET, MorseSignal } from '../morse-alphabet';
import { SignalComponent } from "../signal/signal.component";
import { bufferUntilIdle } from '../operators/buffer-until-idle.operator';
import { appendOnceAfterIdleTime } from '../operators/append-once-after-idle-time.operator';
import { DOT_DURATION_IN_MS } from 'src/main';

@Component({
    selector: 'app-decode',
    templateUrl: './decode.component.html',
    styleUrls: ['./decode.component.scss'],
    imports: [CommonModule, SignalComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecodeComponent {

  public signal$ = new Subject<0 | 1>();
  public decodedText$: Observable<string>;

  constructor(@Inject(MORSE_ALPHABET) private alphabet: Map<Letter, MorseSignal[]>,
    @Inject(DOT_DURATION_IN_MS) private dotTimeInMs: number) {
    const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(filter(({ key }) => key === ' '));
    const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter(({ key }) => key === ' '));

    const activityIndicator$ = keyDown$.pipe(
      switchMap(() => timer(0, 20).pipe(takeUntil(keyUp$))),
    );

    const escapePressed$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      filter(({ key }) => key === 'Escape'),
      map(() => undefined),
    );

    this.decodedText$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(() => merge(of(''), merge(keyUp$, keyDown$).pipe(
          distinctUntilKeyChanged('type'),
          tap(({ type }) => this.signal$.next(type === 'keydown' ? 1 : 0)),
          pairwise(),
          filter(([{ type: lhs }, { type: rhs }]) => lhs === 'keydown' && rhs === 'keyup'),
          map(([{ timeStamp: downTimeStamp }, { timeStamp: upTimeStamp }]) => upTimeStamp - downTimeStamp > 3 * dotTimeInMs ? '-' : '·'),
          bufferUntilIdle(3 * dotTimeInMs, activityIndicator$), // char end after 3 * dot time of idle
          map(emittedSignals => this.decode(emittedSignals)),
          appendOnceAfterIdleTime(3 * 4 * dotTimeInMs, ' ', activityIndicator$),
          scan<string, string>((acc, value) => acc + value, ''),
        ),
      ))
    );
  }

  private decode(signalsToDecode: MorseSignal[]): Letter | '?' {
    for (const [letter, signals] of this.alphabet) {
      if (signals.join('') === signalsToDecode.join('')) {
        return letter;
      }
    }
    return '?';
  }
}
