import { interval, take, tap, map, delay, merge, connect, Subject } from 'rxjs';
describe('Using selectors', () => {
  // Augmented time for test to 10 seconds
  jest.setTimeout(10000);

  it('Should create a multicast observable with a selector', done => {
    const observerA = {
      next: (value: [string, string, number]) => console.log('Observer A', value),

      error: (error: Error) => console.log('Observer A error', error),

      complete: () => {
        console.log('Observer A complete');
      }
    };

    const observerB = {
      next: (value: [string, string, number]) => console.log('Observer B', value),

      error: (error: Error) => console.log('Observer B error', error),

      complete: () => {
        console.log('Observer B complete');
      }
    };

    const ob$ = interval(1000).pipe(
      map((value): [string, number] => [`Execution: ${value}`, Math.random()]),
      tap(value => console.log('Emited: ', value)),
      take(4)
    );

    // Comportamiento normal sin selector, cada observer recibe los valores
    // emitidos por el observable original, hay dos ejecuciones del observable
    // original, una para cada observer

    const resultDelayed$ = ob$.pipe(
      delay(500),

      map((value): [string, string, number] => ['Delayed', ...value])
    );

    const resultNotDelayed$ = ob$.pipe(map((value): [string, string, number] => ['Not delayed', ...value]));

    const resultA$ = merge(resultDelayed$, resultNotDelayed$);

    // ~~~~~~

    // Comportamiento con selector, solo hay una ejecución del observable original

    const resultShared$ = ob$.pipe(
      connect(
        // Aqui ob$ es el observable original pero compartido con share()
        // y el resultado de la función es el observable que se va a devolver
        // a result$
        sharedOb$ => {
          const resultDelayed$ = sharedOb$.pipe(
            delay(500),

            map((value): [string, string, number] => ['Delayed', ...value])
          );

          const resultNotDelayed$ = sharedOb$.pipe(map((value): [string, string, number] => ['Not delayed', ...value]));

          // Merge the original observable with the delayed observable
          // and both will be subscribed to the same subject

          const result$ = merge(resultDelayed$, resultNotDelayed$);

          return result$;
        },
        {
          connector: () => new Subject()
        }
      )
    );

    resultA$.subscribe(observerA);

    resultShared$.subscribe(observerB);

    setTimeout(done, 5000);

    /**
     *
     * Output observableA: Two executions of ob$ rx !== Rx
     *
     * Time:                0---  --- 1---  --- 2---  --- 3---  --- 4---  --- 5---  --- 6---  --- 7---
     *
     * ResultDelayed$:
     * Ob$:                  ---  ---r1---  ---r2---  ---r3---  ---r4|
     * Delay$:                    ---  ---r1---  ---r2---  ---r3---  ---r4|
     *
     * NotResultDelayed$:
     * Ob$:                  ---  ---R1---  ---R2---  ---R3---  ---R4|
     *
     *                      merge(resultDelayed$, resultNotDelayed$)
     *
     * resultA$              --- ---R1---r1---R2---r2---R3---r3---R4---r4|
     *
     *
     * Output observableB: Selector, just one execution of ob$ rx === rx
     *
     * Time:                0---  --- 1---  --- 2---  --- 3---  --- 4---  --- 5---  --- 6---  --- 7---
     *
     * sharedOb$:
     * Ob$:                  ---  ---r1---  ---r2---  ---r3---  ---r4|
     * resultNotDelayed$     ---  ---r1---  ---r2---  ---r3---  ---r4|
     * resultDelayed$             ---  ---r1---  ---r2---  ---r3---  ---r4|
     *                      merge(resultDelayed$, resultNotDelayed$)
     *
     * resultShared$         --- ---r1---r1---r2---r2---r3---r3---r4---r4|
     **/
  });
});
