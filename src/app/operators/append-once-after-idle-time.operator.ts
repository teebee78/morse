import { Observable, OperatorFunction, switchMap, timer } from "rxjs";

export function appendOnceAfterIdleTime<T, U>(minIdleTime: number, value: U, activityIndicator$?: Observable<unknown>): OperatorFunction<T, T | U> {
    return (source: Observable<T>) => new Observable<T | U>(subscriber => {
      const activitySubscription = (activityIndicator$ ?? source).pipe(
        switchMap(() => timer(minIdleTime))
      )
      .subscribe(() => subscriber.next(value));
  
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
        subscription.unsubscribe();
      }
    });
  }