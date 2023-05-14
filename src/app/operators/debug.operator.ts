import { MonoTypeOperatorFunction, tap } from "rxjs";

export function debug<T>(tag: string): MonoTypeOperatorFunction<T> {
    return tap<T>({
        next(value) { console.log(`%c[${tag}: Next]`, 'background-color: #555; font-size: 9px; padding: 0px 3px; border-radius: 3px', value) },
        error(error) { console.log(`%c[${tag}: Error]`, 'background-color: red; color: #fff; padding: 0px 3px; border-radius: 3px', error) },
        complete() { console.log(`%c[${tag}: Complete]`, 'background-color: black; color: #fff; padding: 0px 3px; border-radius: 3px') }
    });
}