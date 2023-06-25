/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { interval, take, connectable, Subject, ReplaySubject, Subscription } from 'rxjs';

describe('Using a Multicast', () => {
  it('Should create a connectable observable with default Subject', done => {
    const observerA = {
      next: (value: number) => console.log('Observer A', value),
      error: (error: Error) => console.log('Observer A error', error),
      complete: () => console.log('Observer A complete')
    };

    const observerB = {
      next: (value: number) => console.log('    Observer B', value),
      error: (error: Error) => console.log('    Observer B error', error),
      complete: () => {
        console.log('    Observer B complete');

        done();
      }
    };

    // Create an observable that emits a value every second
    // and completes after 5 values
    const obs$ = interval(500).pipe(take(5));

    // Connectable observable let you control when to start emitting values
    // and share the same subscription between multiple observers
    // like a Subject but with more control and less boilerplate
    const connectableSubject = connectable(obs$);

    setTimeout(() => {
      // Observer B subscribes after 2 second
      // and because the observable is connectable
      // using a Subject, it will receive the next values
      // emitted by the observable after it subscribes

      connectableSubject.subscribe(observerB);
    }, 2000);

    // Observer A subscribes to the subject
    // but only receives values after the subject is connected
    connectableSubject.subscribe(observerA);

    setTimeout(() => {
      // Observer A subscribes to the subject
      // just in this moment the observable will start emitting values
      // and Observer A will receive the values emitted by the observable

      connectableSubject.connect();

      console.log('Connected...');
    }, 500);

    /*

      Output:

      Connectable:    0---1---2---3---4|
      Observer A      0---1---2---3---4|
      Observer B              2---3---4|

    */
  });

  it('Should create a connectable observable with a Subject factory', done => {
    const observerA = {
      next: (value: number) => console.log('Observer A', value),
      error: (error: Error) => console.log('Observer A error', error),
      complete: () => console.log('Observer A complete')
    };

    const observerB = {
      next: (value: number) => console.log('    Observer B', value),
      error: (error: Error) => console.log('    Observer B error', error),
      complete: () => {
        console.log('    Observer B complete');

        done();
      }
    };

    // Create an observable that emits a value every second
    // and completes after 5 values
    const obs$ = interval(500).pipe(take(5));

    // Connectable observable let you control when to start emitting values
    // and share the same subscription between multiple observers
    // like a Subject but with more control and less boilerplate
    const connectableSubject = connectable(obs$, { connector: () => new Subject() });

    setTimeout(() => {
      // Observer B subscribes after 2 second
      // and because the observable is connectable
      // using a Subject, it will receive the next values
      // emitted by the observable after it subscribes

      connectableSubject.subscribe(observerB);
    }, 2000);

    // Observer A subscribes to the subject
    // but only receives values after the subject is connected
    connectableSubject.subscribe(observerA);

    setTimeout(() => {
      // Observer A subscribes to the subject
      // just in this moment the observable will start emitting values
      // and Observer A will receive the values emitted by the observable

      connectableSubject.connect();

      console.log('Connected...');
    }, 500);

    /*

      Output:

      Connectable:    0---1---2---3---4|
      Observer A      0---1---2---3---4|
      Observer B              2---3---4|

    */
  });

  it('Should create a connectable observable with a ReplaySubject', done => {
    const observerA = {
      next: (value: number) => console.log('Observer A', value),
      error: (error: Error) => console.log('Observer A error', error),
      complete: () => console.log('Observer A complete')
    };

    const observerB = {
      next: (value: number) => console.log('    Observer B', value),
      error: (error: Error) => console.log('    Observer B error', error),
      complete: () => {
        console.log('    Observer B complete');

        done();
      }
    };

    // Create an observable that emits a value every second
    // and completes after 5 values
    const obs$ = interval(500).pipe(take(5));

    // Connectable observable let you control when to start emitting values
    // and share the same subscription between multiple observers
    // like a Subject but with more control and less boilerplate
    const connectableSubject = connectable(obs$, { connector: () => new ReplaySubject() });

    setTimeout(() => {
      // Observer B subscribes after 3 second
      // and because the observable is connectable
      // using a Subject, it will receive the next values
      // emitted (Replay) by the observable after it subscribes

      connectableSubject.subscribe(observerB);
    }, 3000);

    // Observer A subscribes to the subject
    // but only receives values after the subject is connected
    connectableSubject.subscribe(observerA);

    setTimeout(() => {
      // Observer A subscribes to the subject
      // just in this moment the observable will start emitting values
      // and Observer A will receive the values emitted by the observable

      connectableSubject.connect();

      console.log('Connected...');
    }, 500);

    /*

      Output:

      Connectable:    0---1---2---3---4|
      Observer A      0---1---2---3---4|
      Observer B          (0,1,2,3)---4|

    */
  });

  it('Should create a unsubscribe from a connectable inifinite observable', done => {
    const observerA = {
      next: (value: number) => console.log('Observer A', value),
      error: (error: Error) => console.log('Observer A error', error),
      complete: () => console.log('Observer A complete')
    };

    const observerB = {
      next: (value: number) => console.log('    Observer B', value),
      error: (error: Error) => console.log('    Observer B error', error),
      complete: () => console.log('    Observer B complete')
    };

    // Subscription to the connectable observable

    let connectableSubscription: Subscription;

    // Create an observable that emits a value every second
    // and never completes

    const obs$ = interval(500);

    // Connectable observable let you control when to start emitting values
    // and share the same subscription between multiple observers
    // like a Subject but with more control and less boilerplate

    // No es necesario mantener las subscripciones a los observables
    // ya que el connectable observable se encarga de mantener la subscripción
    // y desuscribirse de los observables cuando se desuscribe de él
    // Es la version actual de multicast: obs$.pipe(multicast(new Subject()));

    const connectableSubject = connectable(obs$, { connector: () => new ReplaySubject(), resetOnDisconnect: false });

    setTimeout(() => {
      // Observer B subscribes after 3 second
      // and because the observable is connectable
      // using a Subject, it will receive the next values
      // emitted (Replay) by the observable after it subscribes

      connectableSubject.subscribe(observerB);
    }, 3000);

    // Observer A subscribes to the subject
    // but only receives values after the subject is connected

    // No es necesario mantener las subscripciones a los observables
    // ya que el connectable observable se encarga de mantener la subscripción
    // y desuscribirse de los observables cuando se desuscribe de él

    connectableSubject.subscribe(observerA);

    setTimeout(() => {
      // Observer A subscribes to the subject
      // just in this moment the observable will start emitting values
      // and Observer A will receive the values emitted by the observable

      connectableSubscription = connectableSubject.connect();

      console.log('Connected...');

      setTimeout(() => {
        // Unsubscribe from the connectable observable
        // this will unsubscribe all the observers

        connectableSubscription.unsubscribe();

        done();
      }, 4000);
    }, 500);

    /*

      Output:

      Connectable:    0---1---2---3---4---5---6
      Observer A      0---1---2---3---4---5---6
      Observer B          (0,1,2,3)---4---5---6

    */
  });
});
