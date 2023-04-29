import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Observable, concatMap, endWith, filter, from, fromEvent, map, scan } from 'rxjs';
import { debug } from '../debug-operator';
import { delayEach } from '../delay-each';
import { CHAR_END, MAP } from '../morse';
import { SignalComponent } from '../signal/signal.component';

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
  private readonly durationInMs = 500;

  constructor(@Inject(MAP) charMap: Map<string, readonly (0 | 1)[]>) {
    const keyDownEvents$ = fromEvent(document, 'keydown').pipe(
      map(event => (event as KeyboardEvent)), 
      filter(event => event.key.length == 1)
    );

    this.typedText$ = keyDownEvents$.pipe(
      scan((acc, {key}) => acc + key, '')
    );

    this.signal$ = keyDownEvents$.pipe(
      map(({key}) => charMap.get(key)),
      filter(Boolean),
      concatMap(sequence => from(sequence).pipe(
        endWith(...CHAR_END),
      )),
      delayEach(this.durationInMs),
      debug("Morse"),
    );
  }
}
