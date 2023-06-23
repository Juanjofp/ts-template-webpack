import { interval, take, Observer } from 'rxjs';

describe('A Bridge observer', () => {
  it('Should share an observable between observers', done => {
    // Bridge observer (A basic Subject)

    type BridgeObserver<T> = {
      observers: Observer<T>[];

      subscribe: (this: BridgeObserver<T>, observer: Observer<T>) => void;

      next: (this: BridgeObserver<T>, value: T) => void;

      error: (this: BridgeObserver<T>, error: Error) => void;

      complete: (this: BridgeObserver<T>) => void;
    };

    function createBridge<T>() {
      const bridgeObserver: BridgeObserver<T> = {
        observers: [],

        subscribe(observer) {
          this.observers.push(observer);
        },

        next(value) {
          this.observers.forEach(subscriber => subscriber.next(value));
        },

        error(error) {
          this.observers.forEach(subscriber => subscriber.error(error));
        },

        complete() {
          this.observers.forEach(subscriber => subscriber.complete());
        }
      };

      return bridgeObserver;
    }

    // Use BridgeObserver

    // ~~~~~~ Create observable

    const obs$ = interval(500).pipe(take(5));

    // Create bridge

    const bridge = createBridge<number>();

    // Subscribe bridge to observable

    obs$.subscribe(bridge);

    // Subscribe subscriber1 to bridge

    bridge.subscribe({
      next: value => {
        console.log('Subscriber1', value);
      },

      error: error => {
        console.log('Subscriber1 error', error);
      },

      complete: () => {
        console.log('Subscriber1 complete');
      }
    });

    // Subcribe subscriber2 after 2 seconds

    setTimeout(() => {
      bridge.subscribe({
        next: value => {
          console.log('    Subscriber2', value);
        },

        error: error => {
          console.log('    Subscriber2 error', error);
        },

        complete: () => {
          console.log('    Subscriber2 complete');

          done();
        }
      });
    }, 2000);
  });
});

/* Console output:

Subscriber1 0
Subscriber1 1
Subscriber1 2
Subscriber1 3
    Subscriber2 3
Subscriber1 4
    Subscriber2 4
Subscriber1 complete
    Subscriber2 complete

*/
