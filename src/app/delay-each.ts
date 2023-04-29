import { MonoTypeOperatorFunction, concatMap, delay, of } from "rxjs";

export function delayEach<T>(delayInMs: number): MonoTypeOperatorFunction<T> {
    return concatMap(each => of(each).pipe(delay<T>(delayInMs)));
}
