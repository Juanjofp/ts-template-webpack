import { interval, tap, Subscription, share } from 'rxjs';

describe('Using refCount', () => {
  it('Should create a automatically connectable observable and unsubscribe when no observer', done => {
    // Observers

    const observerA = {
      next: (value: number) => console.log('--Observer A', value),
      error: (error: Error) => console.log('--Observer A error', error),
      complete: () => console.log('--Observer A complete')
    };

    const observerB = {
      next: (value: number) => console.log('---- Observer B', value),
      error: (error: Error) => console.log('---- Observer B error', error),
      complete: () => console.log('---- Observer B complete')
    };

    // Subscriptions

    let subscriptionA: Subscription;
    let subscriptionB: Subscription;

    // Create an observable that emits a value every 300ms

    const obs$ = interval(300).pipe(tap(v => console.log('->Emit Value', v)));

    // Automatically connect when the first observer subscribes
    // publish = multicast + Subject
    // share = publish().refCount()

    const autoConnectObs$ = obs$.pipe(share());

    setTimeout(() => {
      // Subscribe observer A to the observable
      console.log('===== Subscribe observer A =====');

      subscriptionA = autoConnectObs$.subscribe(observerA);
    }, 1000);

    setTimeout(() => {
      // Subscribe observer B to the observable
      console.log('===== Subscribe observer B ====');

      subscriptionB = autoConnectObs$.subscribe(observerB);
    }, 2000);

    setTimeout(() => {
      // Unsubscribe observer A
      console.log('Unsubscribe observer A');

      subscriptionA.unsubscribe();
    }, 3000);

    setTimeout(() => {
      // Unsubscribe observer B
      console.log('Unsubscribe observer B');

      subscriptionB.unsubscribe();
    }, 4000);

    setTimeout(() => {
      // End test

      console.log('End test');

      done();
    }, 4000);
    /*

      Output:
                 S(A)        S(B)      U(A)         U(B)
                   |           |         |            |
      Share:       0---1---2---3---4---5---6---7---8--
      Observer A   0---1---2---3---4---5-
      Observer B               3---4---5---6---7---8--

    */
  });
});
