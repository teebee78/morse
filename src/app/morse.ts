import { InjectionToken } from "@angular/core";

export const SPACE_ENCODED: readonly (0 | 1)[] = [0, 0, 0, 0];
export const CHAR_END: readonly(0 | 1)[] = [0, 0, 0];
/*
- dash: three 1s in a row
- dot: sigle 1
- separated by a single 0
- letters are separated by three 0s
- words are separated by seven 0s (four 0's = space + three 0s of char end)
*/
export const MAP = new InjectionToken<Map<string, readonly (0 | 1)[]>>(
    'Morse code dictionary',
    {
        factory: () => new Map([
            [' ', SPACE_ENCODED],
            ['a', [1, 0, 1, 1, 1]],
            ['b', [1, 1, 1, 0, 1, 0, 1, 0, 1]],
            ['c', [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1]],
            ['d', [1, 1, 1, 0, 1, 0, 1]],
            ['e', [1]],
            ['f', [1, 0, 1, 0, 1, 1, 1, 0, 1]],
            ['g', [1, 1, 1, 0, 1, 1, 1, 0, 1]],
            ['h', [1, 0, 1, 0, 1, 0, 1]],
            ['i', [1, 0, 1]],
            ['j', [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1]],
            ['k', [1, 1, 1, 0, 1, 0, 1, 1, 1]],
            ['l', [1, 0, 1, 1, 1, 0, 1, 0, 1]],
            ['m', [1, 1, 1, 0, 1, 1, 1]],
            ['n', [1, 1, 1, 0, 1]],
            ['o', [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1]],
            ['p', [1, 0, 1, 1, 1, 0, 1, 1, 1, 0]],
            ['q', [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1]],
            ['r', [1, 0, 1, 1, 1, 0, 1]],
            ['s', [1, 0, 1, 0, 1]], 
            ['t', [1, 1, 1]],
            ['u', [1, 0, 1, 0, 1, 1, 1]],
            ['v', [1, 0, 1, 0, 1, 1, 1]],
            ['w', [1, 0, 1, 1, 1, 0, 1, 1, 1]],
            ['x', [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1]],
            ['y', [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1]],
            ['z', [1, 1, 0, 1, 1, 1, 0, 1, 0, 1]]
        ])
    }
); 