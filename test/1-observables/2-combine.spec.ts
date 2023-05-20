import {
  interval,
  take,
  combineLatestWith,
  filter,
  combineLatest,
  map,
  combineLatestAll,
  of,
  withLatestFrom,
  tap
} from 'rxjs';

jest.setTimeout(10000);

describe('Combine operators', () => {
  // combineLatestWith

  it('should combineLatestWith operators', done => {
    const result: number[][] = [];

    const expected = [
      [0, 1], // Emit first observable 0 and combine with second observable 1
      [0, 3], // Emit second observable 3 and combine with first observable 0
      [2, 3], // Emit first observable 2 and combine with second observable 3
      [2, 5], // Emit second observable 5 and combine with first observable 2
      [2, 7] // Emit second observable 7 and combine with first observable 2
    ];

    const obs1$ = interval(500).pipe(
      filter(value => value % 2 === 0),
      take(2)
    );

    const obs2$ = interval(250).pipe(
      filter(value => value % 2 !== 0),
      take(4)
    );

    const resutl$ = obs1$.pipe(combineLatestWith(obs2$));

    resutl$.subscribe({
      next: value => {
        result.push(value);
      },

      complete: () => {
        expect(result).toEqual(expected);

        done();
      }
    });
  });

  // combineLatest

  it('should combineLatest operators', done => {
    const result: number[][] = [];

    const expected = [
      [0, 1], // Emit first observable 0 and combine with second observable 1
      [0, 3], // Emit second observable 3 and combine with first observable 0
      [2, 3], // Emit first observable 2 and combine with second observable 3
      [2, 5], // Emit second observable 5 and combine with first observable 2
      [2, 7] // Emit second observable 7 and combine with first observable 2
    ];

    const obs1$ = interval(500).pipe(
      filter(value => value % 2 === 0),
      take(2)
    );

    const obs2$ = interval(250).pipe(
      filter(value => value % 2 !== 0),
      take(4)
    );

    const resutl$ = combineLatest([obs1$, obs2$], (value1, value2) => [value1, value2]);

    resutl$.subscribe({
      next: value => {
        result.push(value);
      },

      complete: () => {
        expect(result).toEqual(expected);

        done();
      }
    });
  });

  // combineAll

  it('should combineAll operators', done => {
    const result: number[][] = [];

    const expected = [
      [0, 0, 0], // Emit third inner observable 0 and combine with first and second inner observables
      [1, 0, 0], // Emit first inner observable 1 and combine with second and third inner observables
      [1, 1, 0], // Emit second inner observable 1 and combine with first and third inner observables
      [1, 1, 1], // Emit third inner observable 1 and combine with first and second inner observables
      [2, 1, 1], // Emit first inner observable 2 and combine with second and third inner observables
      [2, 2, 1], // Emit second inner observable 2 and combine with first and third inner observables
      [2, 2, 2], // ...
      [3, 2, 2],
      [3, 3, 2],
      [3, 3, 3]
    ];

    const obs1$ = of(1, 2, 3);

    const resutl$ = obs1$.pipe(
      map(value => {
        // console.log('Inner observable', value);

        return interval(100).pipe(
          tap(innerValue => console.log('Obs', value, 'inner', innerValue)),
          take(4)
        );
      }),

      // Do not subscribe to inner observables until outer observable completes
      // to know how many inner observables we have to subscribe to
      combineLatestAll()
    );

    resutl$.subscribe({
      next: value => {
        result.push(value);
      },

      complete: () => {
        console.log(result);
        expect(result).toEqual(expected);

        done();
      }
    });
  });

  // withLatestFrom

  it('should withLatestFrom operators', done => {
    const result: number[][] = [];

    const expected = [
      [0, 0], // Emit first observable 0 and combine with second observable 0
      [1, 2], // Emit first observable 1 and combine with second observable 2
      [2, 4], // Emit first observable 2 and combine with second observable 4
      [3, 6] // Emit first observable 3 and combine with second observable 6
    ];

    const obs1$ = interval(500).pipe(take(4));

    const obs2$ = interval(250).pipe(take(8));

    // Only emit when first observable emits, and combine with latest value from second observable

    const resutl$ = obs1$.pipe(withLatestFrom(obs2$));

    resutl$.subscribe({
      next: value => {
        result.push(value);
      },

      complete: () => {
        expect(result).toEqual(expected);

        done();
      }
    });
  });
});
