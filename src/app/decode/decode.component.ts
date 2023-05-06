import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subject, concat, concatMap, distinctUntilKeyChanged, filter, from, fromEvent, iif, interval, map, merge, pairwise, scan, switchMap, take, takeUntil, tap, timer } from 'rxjs';
import { DOT_DURATION_IN_MS, Letter, MORSE_ALPHABET, MorseSignal } from '../morse-alphabet';
import { SignalComponent } from "../signal/signal.component";
import { debug } from '../debug-operator';

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

  constructor(@Inject(MORSE_ALPHABET) private alphabet: Map<Letter, MorseSignal[]>,
    @Inject(DOT_DURATION_IN_MS) private dotTimeInMs: number) {
    const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(filter(({ key }) => key === ' '));
    const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter(({ key }) => key === ' '));

    const activityIndicator$ = keyDown$.pipe(
      switchMap(_ => timer(0, 20).pipe(takeUntil(keyUp$))),
    );

    console.log('dot time', dotTimeInMs);

    this.decodedText$ = merge(keyUp$, keyDown$).pipe(
      distinctUntilKeyChanged('type'),
      tap(({ type }) => this.signal$.next(type === 'keydown' ? 1 : 0)),
      pairwise(),
      filter(([{ type: lhs }, { type: rhs }]) => lhs === 'keydown' && rhs === 'keyup'),
      map(([{ timeStamp: downTimeStamp }, { timeStamp: upTimeStamp }]) => upTimeStamp - downTimeStamp > 3 * dotTimeInMs ? '-' : '.'),
      bufferUntilIdle(3 * dotTimeInMs, activityIndicator$), // char end after 3 * dot time of idle
      map(emittedSignals => this.decode(emittedSignals)),
      appendOnceAfterIdleTime(3 * 4 * dotTimeInMs, ' ', activityIndicator$),
      scan((acc, value) => acc + value)
    );
  }

  private decode(signalsToDecode: MorseSignal[]): Letter | '?' {
    for (let [letter, signals] of this.alphabet) {
      if (signals.join('') === signalsToDecode.join('')) {
        return letter;
      }
    }
    return '?';
  }
}


/**
 *  emits the collected values after activityIndicator$ did not emit any value for minIdleTime ms. 
**/
function bufferUntilIdle(minIdleTime: number, activityIndicator$: Observable<any>) {
  return function <T>(source: Observable<T>): Observable<T[]> {
    return new Observable(subscriber => {
      var buffer: T[] = [];
      const tickerSubscription = activityIndicator$.pipe(
        switchMap(_ => timer(minIdleTime)),
      ).subscribe(_ => {
        console.log('>>>> char end');
        subscriber.next(buffer);
        buffer = [];
      });

      const sourceSubscription = source.subscribe({
        next(value) {
          buffer.push(value);
        },

        error(error) {
          subscriber.error(error);
        },

        complete() {
          subscriber.complete();
        }
      });

      return () => {
        tickerSubscription.unsubscribe();
        sourceSubscription.unsubscribe();
      }
    })
  }
}

function appendOnceAfterIdleTime<T>(minIdleTime: number, value: T, activityIndicator$?: Observable<any>): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => new Observable<T>(subscriber => {
    const activitySubscription = iif(() => !!activityIndicator$, activityIndicator$!, source).pipe(
      switchMap(_ => timer(minIdleTime))
    ).subscribe(_ => {
      console.log('>>>> world end');
      subscriber.next(value)
    });

    const subscription = source.subscribe({
      next(each) {
        subscriber.next(each);
      },

      error(error) {
        subscriber.error(error);
      },

      complete() {
        subscriber.complete();
      },
    });

    return () => {
      activitySubscription.unsubscribe();
      subscriber.unsubscribe();
    }
  });
}

// function appendOnceAfterIdleTime<T>(idleTime: number, value: T): MonoTypeOperatorFunction<T> {
//   return function <T>(source: Observable<T>): Observable<T> {
//     return new Observable<T>(subscriber => {

//       const activityIndicator$ = new Subject<void>();
//       const inactivitySubscription = activityIndicator$.pipe(
//         switchMap(_ => timer(idleTime).pipe(map(_ => value))),
//         debug('INACTIVE')
//       ).subscribe(value => subscriber.next(value as (T | undefined)));

//       source.subscribe({
//         next(value) {
//           activityIndicator$.next();
//           subscriber.next(value);
//         },

//         error(err) {
//           subscriber.error(err);
//           inactivitySubscription.unsubscribe();
//         },

//         complete() {
//           subscriber.complete();
//           inactivitySubscription.unsubscribe();
//         },
//       });
//     });
//   }
// }