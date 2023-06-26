import { interval, Subject, connectable, tap, take, Subscription, share } from 'rxjs';

describe('Factory Subject', () => {
  // More time for every test
  jest.setTimeout(30000);

  it('Should complete when subject is completed without a factory', done => {
    const observerA = {
      next: (value: number) => {
        console.log(`observerA: ${value}`);
      },

      error: (error: Error) => console.log(`observerA: ${error}`),

      complete: () => console.log('observerA complete!')
    };

    const observerB = {
      next: (value: number) => console.log(`--- observerB: ${value}`),

      error: (error: Error) => console.log(`--- observerB: ${error}`),

      complete: () => console.log('--- observerB complete!')
    };

    const ob$ = interval(500).pipe(
      tap(value => console.log(`emitted: ${value}`)),
      take(100)
    );

    // Connectable without factory behaiviour

    /**
     * The default configuration for `connectable`.
     */
    const connectableConfig = {
      /**
       * A factory function used to create the Subject through which the source
       * is multicast. By default this creates a {@link Subject}.
       */

      connector: () => new Subject<number>(),

      /**
       * If true, the resulting observable will reset internal state upon disconnection
       * and return to a "cold" state. This allows the resulting observable to be
       * reconnected.
       * If false, upon disconnection, the connecting subject will remain the
       * connecting subject, meaning the resulting observable will not go "cold" again,
       * and subsequent repeats or resubscriptions will resubscribe to that same subject.
       */
      resetOnDisconnect: false
    };
    const sharedObs$ = connectable(ob$, connectableConfig);

    let subShared: Subscription;

    // ~~~~~~ Start connectable after 2 seconds ~~~~~~

    setTimeout(() => {
      console.log('1. Connect sharedObs$');

      subShared = sharedObs$.connect();
    }, 1000);

    // ~~~~~~ First subscription ~~~~~~

    setTimeout(() => {
      console.log('2. Subscribe observerA');

      sharedObs$.subscribe(observerA);
    }, 2000);

    // ~~~~~~ Second subscription ~~~~~~

    setTimeout(() => {
      console.log('3. Subscribe observerB');

      sharedObs$.subscribe(observerB);
    }, 3000);

    setTimeout(() => {
      console.log('4. Unsubscribe sharedObs$');

      subShared.unsubscribe();
    }, 4000);

    setTimeout(() => {
      console.log('5. Connect sharedObs$');

      subShared = sharedObs$.connect();
    }, 5000);

    setTimeout(() => {
      console.log('6. Subscribe observerB again');

      sharedObs$.subscribe(observerB);
    }, 6000);

    setTimeout(() => {
      console.log('7. Subscribe observerA again');

      sharedObs$.subscribe(observerA);
    }, 7000);

    // ~~~~~~ End test after 10 seconds ~~~~~~

    setTimeout(() => {
      console.log('8. End test');

      subShared.unsubscribe();

      done();
    }, 8000);

    /**
     *
     * Output: resetOnDisconnect: true (Hace uso de la factoria y crea un nuevo Subject)
     *
     * Step:              1   2         3        4     5 6       7     8
     * Ob$:               0---1---2---3---4---5--      0---1---2---3---4
     * SharedObs$:        0---1---2---3---4---5--      0---1---2---3---4
     * ObserverA              1---2---3---4---5--                --3---4
     * ObserverB                        --4---5--          1---2---3---4
     *
     *
     * Output: resetOnDisconnect: false // Mantiene el mismo Subject por lo que mantiene las viejas subscripciones (No hace uso de la factoria)
     *
     * Step:              1   2         3        4     5 6       7     8
     * Ob$:               0---1---2---3---4---5--      0---1---2---3---4
     * SharedObs$:        0---1---2---3---4---5--      0---1---2---3---4
     * ObserverA              1---2---3---4---5--      0---1---2---(3,3)---(4,4)
     * ObserverB                        --4---5--      0---(1,1)---(2,2)---(3,3)---(4,4)
     *
     **/
  });

  it('Should use share with a factory to create a new Subject on finite observable and reset/no reset on complete', done => {
    const observerA = {
      next: (value: number) => {
        console.log(`observerA: ${value}`);
      },

      error: (error: Error) => console.log(`observerA: ${error}`),

      complete: () => console.log('observerA complete!')
    };

    const observerB = {
      next: (value: number) => console.log(`--- observerB: ${value}`),

      error: (error: Error) => console.log(`--- observerB: ${error}`),

      complete: () => console.log('--- observerB complete!')
    };

    const ob$ = interval(500).pipe(
      tap(value => console.log(`emitted: ${value}`)),
      take(4)
    );

    // Shared observable with a factory

    const defaultOptions = {
      connector: () => new Subject<number>(),
      resetOnError: true,
      resetOnComplete: true,
      resetOnRefCountZero: true
    };

    console.log('1. Share ob$');

    const sharedObs$ = ob$.pipe(share(defaultOptions));

    // Subscribe observerA

    setTimeout(() => {
      console.log('2. Subscribe observerA');

      sharedObs$.subscribe(observerA);
    }, 1000);

    // Subscribe observerB

    setTimeout(() => {
      console.log('3. Subscribe observerB');

      sharedObs$.subscribe(observerB);
    }, 2200);

    setTimeout(() => {
      console.log('================== NO more observers ==================');
    }, 3500);

    // Subscribe observerA again

    setTimeout(() => {
      console.log('4. Subscribe observerA again');

      sharedObs$.subscribe(observerA);
    }, 4000);

    // Subscribe observerB

    setTimeout(() => {
      console.log('5. Subscribe observerB again');

      sharedObs$.subscribe(observerB);
    }, 5200);

    // End test
    setTimeout(() => {
      console.log('6. End test');

      done();
    }, 6500);

    /**
     *
     * Output:
     * resetOnError: true,
     * resetOnComplete: true, // Se resetea la subscripción al completarse el observable
     * resetOnRefCountZero: true
     *
     *
     * Time:              0--- ---1--- ---2--- ---3--- ---4--- ---5--- ---6---
     * Step:              1       2         3             4         5         6
     * Ob$:                        ---0---1---2---3|       ---0---1---2---3|
     * SharedObs$:                 ---0---1---2---3|       ---0---1---2---3|
     * ObserverA                   ---0---1---2---3|       ---0---1---2---3|
     * ObserverB                             -2---3|                 -2---3|
     *
     *
     * Output:
     * resetOnError: true,
     * resetOnComplete: false, // No se resetea la subscripción al completarse el observable
     * resetOnRefCountZero: true
     *
     * Time:              0--- ---1--- ---2--- ---3--- ---4--- ---5--- ---6---
     * Step:              1       2         3             4         5         6
     * Ob$:                        ---0---1---2---3|       |         |
     * SharedObs$:                 ---0---1---2---3|       |         |
     * ObserverA                   ---0---1---2---3|       |
     * ObserverB                             -2---3|                 |
     *
     **/
  });

  it('Should use share with a factory to create a new Subject on infinite observable with reset on zero ref', done => {
    const observerA = {
      next: (value: number) => {
        console.log(`observerA: ${value}`);
      },

      error: (error: Error) => console.log(`observerA: ${error}`),

      complete: () => console.log('observerA complete!')
    };

    const observerB = {
      next: (value: number) => console.log(`--- observerB: ${value}`),

      error: (error: Error) => console.log(`--- observerB: ${error}`),

      complete: () => console.log('--- observerB complete!')
    };

    const ob$ = interval(500).pipe(tap(value => console.log(`emitted: ${value}`)));

    // Shared observable with a factory

    const defaultOptions = {
      connector: () => new Subject<number>(),
      resetOnError: true,
      resetOnComplete: true,
      resetOnRefCountZero: true
    };

    console.log('1. Share ob$');

    const sharedObs$ = ob$.pipe(share(defaultOptions));

    let subA: Subscription;
    let subB: Subscription;

    // Subscribe observerA

    setTimeout(() => {
      console.log('2. Subscribe observerA');

      subA = sharedObs$.subscribe(observerA);
    }, 1000);

    // Subscribe observerB

    setTimeout(() => {
      console.log('3. Subscribe observerB');

      subB = sharedObs$.subscribe(observerB);
    }, 2200);

    // Unsubscribe observerA

    setTimeout(() => {
      console.log('4. Unsubscribe observerA');

      subA.unsubscribe();
    }, 3000);

    // Subscribe observerB

    setTimeout(() => {
      console.log('5. Unsubscribe observerB');

      subB.unsubscribe();

      console.log('================== NO more observers ==================');
    }, 4000);

    // Subscribe observerA again

    setTimeout(() => {
      console.log('6. Subscribe observerA again');

      subA = sharedObs$.subscribe(observerA);
    }, 5000);

    // Subscribe observerB

    setTimeout(() => {
      console.log('7. Subscribe observerB again');

      subB = sharedObs$.subscribe(observerB);
    }, 6200);

    // Unsubscribe observerA and observerB
    setTimeout(() => {
      console.log('8. Subscribe observerB again');

      subA.unsubscribe();
      subB.unsubscribe();
    }, 7500);

    // End test
    setTimeout(() => {
      console.log('9. End test');

      done();
    }, 8000);

    /**
     *
     * Output:
     * resetOnError: true,
     * resetOnComplete: true,
     * resetOnRefCountZero: true // Se resetea la subscrpición al desuscribirse todos los observables
     *
     * Time:              0--- ---1--- ---2--- ---3--- ---4--- ---5--- ---6--- ---7--- ---8
     * Step:              1       2        3    4         5       6        7          8   9
     * Ob$:                        ---0---1---2---3---4---         ---0---1---2---3--
     * SharedObs$:                 ---0---1---2---3---4---         ---0---1---2---3--
     * ObserverA                   ---0---1---2--                  ---0---1---2---3--
     * ObserverB                            --2---3---4---                  --2---3--
     *
     *
     **/
  });

  it.only('Should use share with a factory to create a new Subject on finite observable without reset on zero ref', done => {
    const observerA = {
      next: (value: number) => {
        console.log(`observerA: ${value}`);
      },

      error: (error: Error) => console.log(`observerA: ${error}`),

      complete: () => console.log('observerA complete!')
    };

    const observerB = {
      next: (value: number) => console.log(`--- observerB: ${value}`),

      error: (error: Error) => console.log(`--- observerB: ${error}`),

      complete: () => console.log('--- observerB complete!')
    };

    const ob$ = interval(500).pipe(
      tap(value => console.log(`emitted: ${value}`)),
      take(12)
    );

    // Shared observable with a factory

    const defaultOptions = {
      connector: () => new Subject<number>(),
      resetOnError: true,
      resetOnComplete: true,
      resetOnRefCountZero: false
    };

    console.log('1. Share ob$');

    const sharedObs$ = ob$.pipe(share(defaultOptions));

    let subA: Subscription;
    let subB: Subscription;

    // Subscribe observerA

    setTimeout(() => {
      console.log('2. Subscribe observerA');

      subA = sharedObs$.subscribe(observerA);
    }, 1000);

    // Subscribe observerB

    setTimeout(() => {
      console.log('3. Subscribe observerB');

      subB = sharedObs$.subscribe(observerB);
    }, 2200);

    // Unsubscribe observerA

    setTimeout(() => {
      console.log('4. Unsubscribe observerA');

      subA.unsubscribe();
    }, 3100);

    // Subscribe observerB

    setTimeout(() => {
      console.log('5. Unsubscribe observerB');

      subB.unsubscribe();

      console.log('================== NO more observers ==================');
    }, 4100);

    // Subscribe observerA again

    setTimeout(() => {
      console.log('6. Subscribe observerA again');

      subA = sharedObs$.subscribe(observerA);
    }, 5100);

    // Subscribe observerB

    setTimeout(() => {
      console.log('7. Subscribe observerB again');

      subB = sharedObs$.subscribe(observerB);
    }, 6200);

    // End test
    setTimeout(() => {
      console.log('8. End test');

      done();
    }, 7500);

    /**
     *
     * Output:
     * resetOnError: true,
     * resetOnComplete: true,
     * resetOnRefCountZero: false // No se resetea la subscrpición al desuscribirse todos los observables
     *
     * Time:              0---  --- 1---  --- 2---  --- 3---  --- 4---  --- 5---  --- 6---  --- 7---
     * Step:              1         2          3         4         5         6          7            8
     * Ob$:                          --- 0--- 1--- 2--- 3--- 4--- 5--- 6--- 7--- 8--- 9---10---11|
     * SharedObs$:                   --- 0--- 1--- 2--- 3--- 4--- 5--- 6--- 7--- 8--- 9---10---11|
     * ObserverA                     --- 0--- 1--- 2--- 3                    --- 8--- 9---10---11|
     * ObserverB                                -- 2--- 3--- 4--- 5                     --10---11|
     *
     *
     **/
  });
});
