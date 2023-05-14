import { merge, take, interval, map, mergeAll, mergeMap } from 'rxjs';

describe('merge operators', () => {
  // ~~~~~~ Merge

  it('should merge values from observables', done => {
    const expectedResult = [
      'Click2-0',
      'Click1-0',
      'Click2-1',
      'Click2-2',
      'Click1-1',
      'Click2-3',
      'Click2-4',
      'Click1-2',
      'Click2-5',
      'Click2-6',
      'Click1-3',
      'Click2-7'
    ];

    const result: string[] = [];

    // An observable wich emits values every 500ms four times

    const clicks$ = interval(500).pipe(
      map(value => `Click1-${value}`),
      take(4)
    );

    // An observable wich emits values every 250ms 8 times

    const clicks2$ = interval(250).pipe(
      map(value => `Click2-${value}`),
      take(8)
    );

    const result$ = merge(clicks$, clicks2$);

    result$.subscribe({
      next: value => {
        result.push(value);
      },

      error: error => console.log('Error', error),

      complete: () => {
        expect(result).toEqual(expectedResult);

        done();
      }
    });
  });

  // ~~~~~~ MergeAll

  it('should merge values from a HOO', done => {
    const expectedResult = [
      '0-0', // Start observable created by first click
      '0-1',
      '1-0', // Start observable created by second click
      '0-2',
      '1-1',
      '0-3',
      '2-0', // Start observable created by third click
      '1-2',
      '0-4',
      '2-1',
      '1-3',
      '0-5',
      '3-0', // Start observable created by fourth click
      '2-2',
      '1-4',
      '0-6',
      '3-1',
      '2-3',
      '1-5',
      '0-7', // Complete observable created by first click
      '3-2',
      '2-4',
      '1-6',
      '3-3',
      '2-5',
      '1-7', // Complete observable created by second click
      '3-4',
      '2-6',
      '3-5',
      '2-7', // Complete observable created by third click
      '3-6',
      '3-7' // Complete observable created by fourth click
    ];

    const result: string[] = [];

    // An observable wich emits values every 500ms four times

    const clicks$ = interval(500).pipe(take(4));

    // Every time clicks$ emits a value, it will be mapped to an interval observable
    // that emits values every 250ms five times.
    // All values from each inner interval observable will be emitted in the result observable.

    const result$ = clicks$.pipe(
      map(clicksValue =>
        // inner interval observable

        interval(250).pipe(
          map(value => `${clicksValue}-${value}`),

          take(8)
        )
      ),

      mergeAll()
    );

    result$.subscribe({
      next: value => {
        result.push(value);
      },

      error: error => console.log('Error', error),

      complete: () => {
        expect(result).toEqual(expectedResult);

        done();
      }
    });
  });

  // ~~~~~~ MergeAll(2)

  it('should merge values from a HOO with 2 in parallel max', done => {
    const expectedResult = [
      '0-0', // Start observable created by first click
      '0-1',
      '1-0', // Start observable created by second click
      '0-2',
      '1-1',
      '0-3',
      '1-2',
      '0-4',
      '1-3',
      '0-5', // Complete observable created by first click
      '1-4',
      '2-0', // Start observable created by third click
      '1-5', // Complete observable created by second click
      '2-1',
      '3-0', // Start observable created by fourth click
      '2-2',
      '3-1',
      '2-3',
      '3-2',
      '2-4',
      '3-3',
      '2-5', // Complete observable created by third click
      '3-4',
      '3-5' // Complete observable created by fourth click
    ];

    const result: string[] = [];

    // An observable wich emits values every 500ms four times

    const clicks$ = interval(500).pipe(take(4));

    // Every time clicks$ emits a value, it will be mapped to an interval observable
    // that emits values every 250ms five times.
    // All values from each inner interval observable will be emitted in the result observable.

    const result$ = clicks$.pipe(
      map(clicksValue =>
        // inner interval observable

        interval(250).pipe(
          map(value => `${clicksValue}-${value}`),

          take(6)
        )
      ),

      mergeAll(2)
    );

    result$.subscribe({
      next: value => {
        result.push(value);
      },

      error: error => console.log('Error', error),

      complete: () => {
        expect(result).toEqual(expectedResult);

        done();
      }
    });
  });

  // ~~~~~~ MergeMap(2)

  it('should merge values from a HOO with map', done => {
    const expectedResult = [
      '0-0', // Start observable created by first click
      '0-1',
      '1-0', // Start observable created by second click
      '0-2',
      '1-1',
      '0-3',
      '1-2',
      '0-4',
      '1-3',
      '0-5', // Complete observable created by first click
      '1-4',
      '2-0', // Start observable created by third click
      '1-5', // Complete observable created by second click
      '2-1',
      '3-0', // Start observable created by fourth click
      '2-2',
      '3-1',
      '2-3',
      '3-2',
      '2-4',
      '3-3',
      '2-5', // Complete observable created by third click
      '3-4',
      '3-5' // Complete observable created by fourth click
    ];

    const result: string[] = [];

    // An observable wich emits values every 500ms four times

    const clicks$ = interval(500).pipe(take(4));

    // Every time clicks$ emits a value, it will be mapped to an interval observable
    // that emits values every 250ms five times.
    // All values from each inner interval observable will be emitted in the result observable.

    const result$ = clicks$.pipe(
      mergeMap(
        clicksValue =>
          // inner interval observable

          interval(250).pipe(
            map(value => `${clicksValue}-${value}`),

            take(6)
          ),
        2
      )
    );

    result$.subscribe({
      next: value => {
        result.push(value);
      },

      error: error => console.log('Error', error),

      complete: () => {
        expect(result).toEqual(expectedResult);

        done();
      }
    });
  });
});
