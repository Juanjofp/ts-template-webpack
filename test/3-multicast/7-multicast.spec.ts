import { interval, take, connectable, Subject, ReplaySubject } from 'rxjs';

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

  it('Should create a connectable observable with a Subject', done => {
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
      // emitted by the observable after it subscribes

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
});
