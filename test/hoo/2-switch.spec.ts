import { switchMap, map, interval, switchAll, switchScan, take } from 'rxjs';

describe('switch operators', () => {
  // Flat operators are used to flatten an observable of observables
  // switch operators are used to switch to a new observable
  // switchMap is the most used operator of this family

  it('should switch to a new observable', done => {
    const expectedResult = [0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4];

    const result: number[] = [];

    // ~~~~~~ Act

    const clicks$ = interval(1000).pipe(take(3));

    const result$ = clicks$.pipe(
      map(() => interval(250).pipe(take(5))),

      switchAll()
    );

    result$.subscribe({
      next: value => result.push(value),

      error: error => console.log('Error', error),

      complete: () => {
        expect(result).toEqual(expectedResult);

        done();
      }
    });
  });

  it('should switchMap to a new observable', done => {
    const expectedResult = [0, 1, 2, 0, 1, 2, 0, 1, 2, 3, 4];

    const result: number[] = [];

    // ~~~~~~ Act

    const clicks$ = interval(1000).pipe(take(3));

    const result$ = clicks$.pipe(switchMap(() => interval(250).pipe(take(5))));

    result$.subscribe({
      next: value => result.push(value),

      error: error => console.log('Error', error),

      complete: () => {
        expect(result).toEqual(expectedResult);

        done();
      }
    });
  });

  it('should accumulate values from observable', done => {
    const expectedResult = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 4];

    const result: number[] = [];

    // ~~~~~~ Act

    const clicks$ = interval(500).pipe(
      map(value => value * 2),
      take(4)
    );

    // switchScan is like scan but it switch to a new observable
    // every time the source observable emit a value
    // It's like a combination of switchMap and scan

    const result$ = clicks$.pipe(
      switchScan((acc, current, index) => {
        // acc is the accumulator, the last value emitted by the observable
        // current is the current value emitted by the source observable (clicks$)
        // index is the index of the current value emitted by the source observable (clicks$)

        console.log('Acc', acc, current, index);

        return interval(100).pipe(take(5));
      }, 0)
    );

    result$.subscribe({
      next: value => result.push(value),

      error: error => console.log('Error', error),

      complete: () => {
        expect(result).toEqual(expectedResult);

        done();
      }
    });
  });
});
