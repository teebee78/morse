import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Observable, Subject, distinctUntilKeyChanged, filter, fromEvent, map, merge, pairwise, scan, switchMap, tap, timer } from 'rxjs';
import { Letter, MORSE_ALPHABET, MorseSignal } from '../morse-alphabet';
import { SignalComponent } from "../signal/signal.component";

@Component({
  selector: 'app-decode',
  standalone: true,
  templateUrl: './decode.component.html',
  styleUrls: ['./decode.component.scss'],
  imports: [CommonModule, SignalComponent],
})
export class DecodeComponent {

  public signal$ = new Subject<0 | 1>();
  public decodedText$: Observable<string>;

  constructor(@Inject(MORSE_ALPHABET) private alphabet: Map<Letter, MorseSignal[]>) {
    const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup');
    const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

    this.decodedText$ = merge(keyUp$, keyDown$).pipe(
      distinctUntilKeyChanged('type'),
      tap(({ type }) => this.signal$.next(type === 'keydown' ? 1 : 0)),
      pairwise(),
      filter(([{ type: lhs }, { type: rhs }]) => lhs === 'keydown' && rhs === 'keyup'),
      map(([{ timeStamp: downTimeStamp }, { timeStamp: upTimeStamp }]) => upTimeStamp - downTimeStamp > 250 ? '-' : '.'),
      bufferWhileIdle(1000, fromEvent(document, 'keypress')),
      map(emittedSignals => this.decode(emittedSignals)),
      scan((acc, value) => acc + value)
    );
  }

  private decode(signalsToDecode: MorseSignal[]): Letter | '_' {
    for (let [letter, signals] of this.alphabet) {
      if (signals.join('') === signalsToDecode.join('')) {
        return letter;
      }
    }
    return '_';
  }
}


/**
 *  emits the collected values after activityIndicator$ did not emit any value for minIdleTime ms. 
**/
function bufferWhileIdle(minIdleTime: number, activityIndicator$: Observable<any>) {
  return function <T>(source: Observable<T>): Observable<T[]> {
    return new Observable(subscriber => {
      var buffer: T[] = [];
      const tickerSubscription = activityIndicator$.pipe(
        switchMap(_ => timer(minIdleTime)),
      ).subscribe(_ => {
        subscriber.next(buffer);
        buffer = [];
      });
      source.subscribe({
        next(value) {
          buffer.push(value);
        },

        error(error) {
          subscriber.error(error);
          tickerSubscription.unsubscribe();
        },

        complete() {
          subscriber.complete();
          tickerSubscription.unsubscribe();
        }
      });
    })
  }
}