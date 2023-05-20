import { interval, timer, takeUntil, Subject } from 'rxjs';

describe('takeUntil', () => {
  // Unsuscribe from observable after 3 seconds

  it('should take values until unsuscribe', done => {
    const expected = [0, 1, 2, 3, 4];

    const result: number[] = [];

    // Create an observable that emits a value every second

    const source$ = interval(500);

    // Emit after 3 seconds

    const unsubscribeAfter4Seconds$ = timer(3000);

    // Emit values until timer emits after 4 seconds

    const resutl$ = source$.pipe(takeUntil(unsubscribeAfter4Seconds$));

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

  // Unsuscribe from observable when a subject emits a value

  it('should take values until unsuscribe by a subject', done => {
    const expected = [0, 1, 2, 3, 4];

    const result: number[] = [];

    // Create an observable that emits a value every second

    const source$ = interval(500);

    // Create a subject that emits a value after 3 seconds

    const subject$ = new Subject();

    setTimeout(() => {
      subject$.next(0);
    }, 3000);

    // Emit values until subject emits

    const resutl$ = source$.pipe(takeUntil(subject$));

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
