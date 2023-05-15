import { MonoTypeOperatorFunction, Observable, OperatorFunction, iif, switchMap, timer } from "rxjs";

export function appendOnceAfterIdleTime<T, U>(minIdleTime: number, value: U, activityIndicator$?: Observable<any>): OperatorFunction<T, T | U> {
    return (source: Observable<T>) => new Observable<T | U>(subscriber => {
      const activitySubscription = iif(() => !!activityIndicator$, activityIndicator$!, source)
      .pipe(
        switchMap(_ => timer(minIdleTime))
      )
      .subscribe(_ => subscriber.next(value));
  
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