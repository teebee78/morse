import { Inject, Injectable } from '@angular/core';
import { BinarySignal, Letter, MORSE_ALPHABET, MorseSignal } from './morse-alphabet';
import { Observable, Operator, OperatorFunction, concat, concatMap, endWith, filter, from, map, subscribeOn } from 'rxjs';
import { delayEach } from './delay-each';
import { CHAR_END } from './morse';
import { sequence } from '@angular/animations';
import { bufferUntilIdle } from './operators/buffer-until-idle.operator';

@Injectable({ providedIn: 'root' })
export class EncodeService {

  constructor(@Inject(MORSE_ALPHABET) private alphabet: Map<Letter, MorseSignal[]>) {
  }

  public encodeLetterToMorseSinal(): OperatorFunction<Letter, MorseSignal[]> {
    return (source: Observable<Letter>) => source.pipe(
      map(letter => this.alphabet.get(letter) ?? []),
    );
  }

  public encodeMorseSignalToBinarySignal(delay: number = 0): OperatorFunction<MorseSignal[], BinarySignal> {
    return source => source.pipe(
        map(morseSignals => morseSignals
          .map(each => (each === '.' ? [1] : [1, 1, 1]) as BinarySignal[])
          .reduce((prev, curr) => (prev.length > 0) ? [...prev, 0, ...curr] : curr, [])
        ), 
        concatMap(sequence => from(sequence).pipe(
          endWith(...CHAR_END)
        )),
        delayEach(delay),
    );
  }

  public decodeBinarySignalToMorseSignal(): OperatorFunction<BinarySignal, MorseSignal> {
    return function(source: Observable<BinarySignal>): Observable<MorseSignal> {
      return new Observable(subscriber => {

        let bufferd1s = 0;
        const sourceSubscription = source.subscribe({
          next(value) {
            if (value === 1) {
              bufferd1s++;
            } else {
              if (bufferd1s === 1) {
                subscriber.next('.');
                bufferd1s = 0;
              } else if (bufferd1s === 3) {
                subscriber.next('-');
                bufferd1s = 0;
              } else if (bufferd1s > 0) {
                subscriber.error('invalid buffer count: ' + bufferd1s);
              }
            }
          },

          error(err) {
            subscriber.error(err);
          },

          complete() {
            subscriber.complete();
          }
        });

        return () => {
          sourceSubscription.unsubscribe();
        }
      });
    }
  }

  public decodeMorseSignalsToLetter(): OperatorFunction<MorseSignal[], Letter | '?'> {
    return source => source.pipe(
      map(signalsToDecode => {
        for (let [letter, signals] of this.alphabet) {
          if (signals.join('') === signalsToDecode.join('')) {
            return letter;
          }
        }
        return '?';
      })
    )
  }

}



