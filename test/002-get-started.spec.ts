import { Observable } from 'rxjs';

describe('Get started with HOO', () => {
  it('should create one observable', done => {
    const result: number[] = [];

    const observable$ = new Observable<number>(subscriber => {
      subscriber.next(1);

      subscriber.next(2);

      subscriber.next(3);

      subscriber.complete();
    });

    observable$.subscribe({
      next: value => result.push(value),

      complete: () => {
        expect(result).toEqual([1, 2, 3]);

        done();
      }
    });
  });
});
