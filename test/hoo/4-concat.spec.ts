import { interval, take, concat, map, concatAll, from, concatMap } from 'rxjs';

describe('concat operator', () => {
  // ~~~~~~ Concat

  it('should concat values from observables', done => {
    const expectedResult = [
      'obs1-click0',
      'obs1-click1',

      'obs2-click0',
      'obs2-click1',
      'obs2-click2',
      'obs2-click3',

      'obs3-click0',
      'obs3-click1',
      'obs3-click2'
    ];

    const result: string[] = [];

    // An observable wich emits values every 500ms 2 times

    const obs1$ = interval(500).pipe(
      map(value => `obs1-click${value}`),
      take(2)
    );

    // An observable wich emits values every 250ms 4 times

    const obs2$ = interval(250).pipe(
      map(value => `obs2-click${value}`),
      take(4)
    );

    // An observable wich emits values every 100ms 3 times

    const obs3$ = interval(100).pipe(
      map(value => `obs3-click${value}`),
      take(3)
    );

    // Concat should wait for the first observable to complete before subscribing to the second one
    // and so on
    // Inportant: concat will never complete if one of the observables never completes

    const result$ = concat(obs1$, obs2$, obs3$);

    // Result

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

  // ~~~~~~ ConcatAll

  it('should concat one observable with the rest of observables', done => {
    const expectedResult = [
      'obs1-click0',
      'obs1-click1',

      'obs2-click0',
      'obs2-click1',
      'obs2-click2',
      'obs2-click3',

      'obs3-click0',
      'obs3-click1',
      'obs3-click2'
    ];

    const result: string[] = [];

    // An observable wich emits values every 500ms 2 times

    const obs1$ = interval(500).pipe(
      map(value => `obs1-click${value}`),
      take(2)
    );

    // An observable wich emits values every 250ms 4 times

    const obs2$ = interval(250).pipe(
      map(value => `obs2-click${value}`),
      take(4)
    );

    // An observable wich emits values every 100ms 3 times

    const obs3$ = interval(100).pipe(
      map(value => `obs3-click${value}`),
      take(3)
    );

    // Concat should wait for the first observable to complete before subscribing to the second one
    // and so on
    // Inportant: concat will never complete if one of the observables never completes

    const result$ = from([obs1$, obs2$, obs3$]).pipe(concatAll());

    // Result

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

  // ~~~~~~ ConcatAll

  it('should concat all values from observables created by obs1$', done => {
    const expectedResult = [
      'obs0-0',
      'obs0-1',
      'obs0-2',
      'obs0-3',

      'obs1-0',
      'obs1-1',
      'obs1-2',
      'obs1-3',

      'obs2-0',
      'obs2-1',
      'obs2-2',
      'obs2-3'
    ];

    const result: string[] = [];

    // An observable wich emits values every 100ms 3 times

    const obs1$ = interval(100).pipe(
      map(value => `obs${value}`),
      take(3)
    );

    // ConcatAll should wait for every observable created by obs1$ to complete before subscribing to the next one
    // and so on
    // Inportant: concatAll will never complete if one of the observables never completes

    const result$ = obs1$.pipe(
      map(value =>
        interval(250).pipe(
          map(intervalIndex => `${value}-${intervalIndex}`),
          take(4)
        )
      ),

      concatAll()
    );

    // Result

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

  // ~~~~~~ ConcatMap

  it('should concat one observable within the map', done => {
    const expectedResult = [
      'obs0-0',
      'obs0-1',
      'obs0-2',
      'obs0-3',

      'obs1-0',
      'obs1-1',
      'obs1-2',
      'obs1-3',

      'obs2-0',
      'obs2-1',
      'obs2-2',
      'obs2-3'
    ];

    const result: string[] = [];

    // An observable wich emits values every 100ms 3 times

    const obs1$ = interval(100).pipe(
      map(value => `obs${value}`),
      take(3)
    );

    // ConcatMap (map(X => obs$) + concatAll()) should wait for the first observable to complete before subscribing to the second one
    // and so on
    // Inportant: concat will never complete if one of the observables never completes

    const result$ = obs1$.pipe(
      concatMap(value =>
        interval(250).pipe(
          map(intervalIndex => `${value}-${intervalIndex}`),
          take(4)
        )
      )
    );

    // Result

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
