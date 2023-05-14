import { MonoTypeOperatorFunction, Observable, iif, switchMap, timer } from "rxjs";

export function appendOnceAfterIdleTime<T>(minIdleTime: number, value: T, activityIndicator$?: Observable<any>): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => new Observable<T>(subscriber => {
      const activitySubscription = iif(() => !!activityIndicator$, activityIndicator$!, source).pipe(
        switchMap(_ => timer(minIdleTime))
      ).subscribe(_ => {
        console.log('>>>> word end');
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