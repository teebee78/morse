import { InjectionToken } from "@angular/core";


export type Letter = ' ' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
export type MorseSignal = '·' | '-';
export type BinarySignal = 0 | 1;

export const SPACE_ENCODED: readonly BinarySignal[] = [0, 0, 0, 0];
export const CHAR_END: readonly BinarySignal[] = [0, 0, 0];

/**
 * Defines the signal duration of a dot. 
 * A dash is when the duraration is 3 * dot duration 
 * A char end is considered after an idle time of 4 * dot time
 * A word end is considered after an idle time of 7 * dot time
 */
// export const DOT_DURATION_IN_MS = new InjectionToken<number>(
//     'Duration of a dot', {
//         factory: () => 100
//     }
// );

export const MORSE_ALPHABET = new InjectionToken<Map<Letter, MorseSignal[]>>(
    'Morse code alphabet',
    {
        factory: () => new Map([
            ['a', ['·', '-']],
            ['b', ['-', '·', '·', '·']],
            ['c', ['-', '·', '-', '·']],
            ['d', ['-', '·', '·']],
            ['e', ['·']],
            ['f', ['·', '·', '-', '·']],
            ['g', ['-', '-', '·']],
            ['h', ['·', '·', '·', '·']],
            ['i', ['·', '·']],
            ['j', ['·', '-', '-', '-']],
            ['k', ['-', '·', '-']],
            ['l', ['·', '-', '·', '·']],
            ['m', ['-', '-']],
            ['n', ['-', '·']],
            ['o', ['-', '-', '-']],
            ['p', ['·', '-', '-', '·']],
            ['q', ['-', '-', '·', '-']],
            ['r', ['·', '-', '·']],
            ['s', ['·', '·', '·']],
            ['t', ['-']],
            ['u', ['·', '·', '-']],
            ['v', ['·', '·', '·', '-']],
            ['w', ['·', '-', '-']],
            ['x', ['-', '·', '·', '-']],
            ['y', ['-', '·', '-', '-']],
            ['z', ['-', '-', '·', '·']],
            ['1', ['·', '-', '-', '-', '-']],
            ['2', ['·', '·', '-', '-', '-']],
            ['3', ['·', '·', '·', '-', '-']],
            ['4', ['·', '·', '·', '·', '-']],
            ['5', ['·', '·', '·', '·', '·']],
            ['6', ['-', '·', '·', '·', '·']],
            ['7', ['-', '-', '·', '·', '·']],
            ['8', ['-', '-', '-', '·', '·']],
            ['9', ['-', '-', '-', '-', '·']],
            ['0', ['-', '-', '-', '-', '-']]
        ])
    }
);