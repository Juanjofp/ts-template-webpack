import { interval, take, map, toArray, filter, share, tap } from 'rxjs';

describe('Hot observable', () => {
  it('should share the same execution path', done => {
    const clock$ = interval(500).pipe(
      tap(v => console.log('Clock execution', v)),
      take(6)
    );

    const randomNumbers$ = clock$.pipe(
      map(() => Math.random() * 100),
      tap(v => console.log('Random execution', v)),
      share()
    );

    const smallNumbers$ = randomNumbers$.pipe(
      tap(v => console.log('Small execution before', v)),
      filter(n => n < 50),
      tap(v => console.log('Small execution after', v)),
      toArray()
    );

    const bigNumbers$ = randomNumbers$.pipe(
      tap(v => console.log('Big execution before', v)),
      filter(n => n >= 50),
      tap(v => console.log('Big execution after', v)),
      toArray()
    );

    randomNumbers$.subscribe(val => console.log('Subscribe Random number', val));

    smallNumbers$.subscribe(val => console.log('Subscribe Small number', val));

    bigNumbers$.subscribe(val => console.log('Subscribe Big number', val));

    setTimeout(done, 3500);
  });
});
