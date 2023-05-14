import { MonoTypeOperatorFunction, Observable, OperatorFunction, iif, switchMap, timer } from "rxjs";

/**
 *  emits the collected values as an array after activityIndicator$ did not emit any value for minIdleTime ms. 
**/
export function bufferUntilIdle<T>(minIdleTime: number, activityIndicator$: Observable<any>): OperatorFunction<T, T[]> { 
    return function <T>(source: Observable<T>): Observable<T[]> {
      return new Observable(subscriber => {
        var buffer: T[] = [];

        const tickerSubscription =  activityIndicator$.pipe(
          switchMap(_ => timer(minIdleTime)),
        )
        .subscribe(_ => {
          subscriber.next(buffer); // TODO Thomas push each one separate or use all? 
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
  };