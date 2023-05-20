import { interval, window, mergeMap, take, toArray, count } from 'rxjs';
describe('window operator', () => {
  // ~~~~~~ Window every second

  it('Should group values emited every second', done => {
    const expected = [
      [0, 1, 2],
      [3, 4, 5, 6],
      [7, 8, 9]
    ];

    const result: number[][] = [];

    const obs$ = interval(250).pipe(take(10));

    const result$ = obs$.pipe(
      window(interval(1000)),
      mergeMap(obs$ => obs$.pipe(toArray()))
    );

    result$.subscribe({
      next: value => {
        result.push(value);
      },

      complete: () => {
        expect(result).toEqual(expected);

        done();
      }
    });
  });

  // ~~~~~~ Window count values

  it('Should group values emited every second', done => {
    const expected = [3, 4, 3];

    const result: number[] = [];

    const obs$ = interval(250).pipe(take(10));

    const result$ = obs$.pipe(
      window(interval(1000)),
      mergeMap(obs$ => obs$.pipe(count()))
    );

    result$.subscribe({
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
