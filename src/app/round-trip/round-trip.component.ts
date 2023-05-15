import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, filter, fromEvent, map, scan, shareReplay, startWith, switchMap } from 'rxjs';
import { EncodeService } from '../encode.service';
import { Letter, MorseSignal } from '../morse-alphabet';
import { bufferUntilIdle } from '../operators/buffer-until-idle.operator';
import { SignalComponent } from '../signal/signal.component';
import { appendOnceAfterIdleTime } from '../operators/append-once-after-idle-time.operator';


@Component({
  selector: 'app-round-trip',
  standalone: true,
  imports: [CommonModule, SignalComponent],
  templateUrl: './round-trip.component.html',
  styleUrls: ['./round-trip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundTripComponent {

  private readonly ENCODE_TIME = 250;

  public typedText$: Observable<string>;

  public encodedMorseSignals$: Observable<MorseSignal[]>;
  public collectedEncodedMorseSignals$: Observable<string>;

  public emittedBinarySignals$: Observable<0 | 1>;
  public collectedEmittedSignals$: Observable<string>;

  public decodedMorseSignals$: Observable<MorseSignal>;
  public collectedDecodedMorseSignals$: Observable<string>;

  public decodedLetter$: Observable<Letter | '?' | ' '>;
  public decodedText$: Observable<string>;

  constructor(encodeService: EncodeService) {

    const typedLetters$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      filter(event => event.key.length == 1),
      map(({ key }) => key)
    );

    const escapePressed$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      filter(({ key }) => key === 'Escape'),
      map(_ => undefined),
      shareReplay({ refCount: false }),
    );

    this.encodedMorseSignals$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(_ => typedLetters$.pipe(
        map(value => value as Letter),
        encodeService.encodeLetterToMorseSinal()
      )),
    );

    this.emittedBinarySignals$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(_ => this.encodedMorseSignals$.pipe(
        encodeService.encodeMorseSignalToBinarySignal(this.ENCODE_TIME)
      ))
    );

    this.decodedMorseSignals$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(_ => this.emittedBinarySignals$.pipe(
        encodeService.decodeBinarySignalToMorseSignal(),
      ))
    );

    const activityIndicator$ = this.emittedBinarySignals$.pipe(filter(each => each === 1));
    this.decodedLetter$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(_ => this.decodedMorseSignals$.pipe(
        bufferUntilIdle(3 * this.ENCODE_TIME, activityIndicator$),
        encodeService.decodeMorseSignalsToLetter(),
        appendOnceAfterIdleTime(7 * this.ENCODE_TIME, ' ' as ' ', activityIndicator$)
      )),
    );

    this.typedText$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(_ => typedLetters$.pipe(
        startWith(''),
        scan((acc, eachLetter) => acc + eachLetter, ''),
      ))
    );

    this.collectedEncodedMorseSignals$ = escapePressed$.pipe(
      startWith(''),
      switchMap(_ => this.encodedMorseSignals$.pipe(
        scan((acc, signals) => acc + ' ' + signals.join(''), ''),
        startWith('')
      ))
    );

    this.collectedEmittedSignals$ = escapePressed$.pipe(
      startWith(''),
      switchMap(_ => this.emittedBinarySignals$.pipe(
        scan((acc, signal) => acc + signal, ''),
        startWith('')
      )
    ));

    this.collectedDecodedMorseSignals$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(_ => this.decodedMorseSignals$.pipe(
        startWith(''),
        scan((acc, eachSinal) => acc + eachSinal, '')
      ))
    );

    this.decodedText$ = escapePressed$.pipe(
      startWith(undefined),
      switchMap(_ => this.decodedLetter$.pipe(
        startWith(''),
        scan((acc, eachSinal) => acc + eachSinal, '')
      ))
    );
  }
}

