import { ReplaySubject } from 'rxjs';

// ReplaySubject: replays many, before or after completion

describe('Using a ReplaySubject', () => {
  it('Should share an observable between observers replay last events', done => {
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

    // ReplaySubject remembers the last 2 values
    const subject = new ReplaySubject<number>(2);

    subject.subscribe(observerA);

    setTimeout(() => {
      // Observer B subscribes after 1 second
      // and receives the last two value (2, 3)
      // because BehaviourSubject remembers the last value
      // and emits it to new subscribers

      subject.subscribe(observerB);
    }, 1000);

    subject.next(1);
    subject.next(2);
    subject.next(3);

    setTimeout(() => {
      subject.complete();

      done();
    }, 2500);

    /*

      Output:

      Subject:    ---1---2---3-----------|
      Observer A  ---1---2---3-----------|
      Observer B                  (2, 3)-|

    */
  });

  it('Should share an observable between observers replay last events in a window size time', done => {
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

    // ReplaySubject remembers the last 10 values
    // and replay only the events emitted in the last 500ms
    const subject = new ReplaySubject<number>(10, 500);

    subject.subscribe(observerA);

    setTimeout(() => {
      // Observer B subscribes after 1 second
      // and receives the last two value (2, 3)
      // because of ReplaySubject remembers the last 10 values
      // and replay only the events emitted in the last 500ms

      subject.subscribe(observerB);
    }, 1000);

    setTimeout(() => subject.next(1), 300);
    setTimeout(() => subject.next(2), 600);
    setTimeout(() => subject.next(3), 900);

    setTimeout(() => {
      subject.complete();

      done();
    }, 2500);

    /*

      Output:

      Subject:    ---1---2---3--------------|
      Observer A  ---1---2---3--------------|
      Observer B                     (2, 3)-|
                        |-- 500ms --|

    */
  });

  it('Should share an observable between observers replay last events even after completed', done => {
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

    // ReplaySubject remembers the last 10 values
    // and replay only the events emitted in the last 5s
    const subject = new ReplaySubject<number>(10, 5000);

    subject.subscribe(observerA);

    setTimeout(() => {
      // Observer B subscribes after 1 second
      // and receives the last two value (1, 2, 3)
      // and completes because the subject is completed

      subject.subscribe(observerB);
    }, 1000);

    setTimeout(() => subject.next(1), 300);
    setTimeout(() => subject.next(2), 600);
    setTimeout(() => subject.next(3), 900);

    setTimeout(() => subject.complete(), 950);

    setTimeout(() => {
      subject.complete();

      done();
    }, 2500);
    /*

      Output:

      Subject:    ---1---2---3-|
      Observer A  ---1---2---3-|
      Observer B                 (1,2,3)-|    

    */
  });
});
