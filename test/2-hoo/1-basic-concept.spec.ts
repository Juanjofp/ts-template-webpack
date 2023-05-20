import { interval, of, map, take } from 'rxjs';

describe('Basic concept', () => {
  it('should create an observable which emit observables', done => {
    const testResult: number[] = [];
    // First observable, it emit values every 1 second

    const obs$ = interval(10).pipe(take(3));

    // Second observable, it map every value emitted by the first observable to a new observable that emit two values

    const obs2$ = obs$.pipe(map(value => of(value, value * 2)));

    // Subscribe to the second observable

    obs2$.subscribe({
      next: value => {
        // Value is an observable, we need to subscribe to it
        // but it IS NOT a good practice to subscribe to an observable inside a subscribe
        // We have mergeMap, switchMap and concatAll to do that

        value.subscribe({
          next: value => {
            testResult.push(value);
          }
        });
      },

      complete: () => {
        expect(testResult).toEqual([0, 0, 1, 2, 2, 4]);

        done();
      }
    });
  });
});
