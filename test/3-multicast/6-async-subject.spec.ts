import { AsyncSubject } from 'rxjs';

// AsyncSubject: replays one, only if completed

describe('Using a AsyncSubject', () => {
  it('Should share an observable and emit only after it completed', done => {
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

    // AsyncSubject remembers the last value
    // and emits it after the subject is completed
    const subject = new AsyncSubject<number>();

    // Observer A subscribes to the subject
    // but only receives the value after the subject is completed
    subject.subscribe(observerA);

    setTimeout(() => {
      // Observer B subscribes after 1 second
      // but only receives the value after the subject is completed

      subject.subscribe(observerB);
    }, 1000);

    subject.next(1); // Observer A and B don't receive this value
    subject.next(2); // Observer A and B don't receive this value
    subject.next(3); // Observer A and B will receive this value after the subject is completed

    setTimeout(() => {
      // After 2.5 seconds the subject is completed
      // and Observer A and B will receive the last value (3)
      subject.complete();

      done();
    }, 2500);

    /*

      Output:

      Subject:    ---1---2---3-----------|
      Observer A  -----------------------3|
      Observer B             ------------3|

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
      complete: () => {
        console.log('    Observer B complete');
        done();
      }
    };

    // AsyncSubject remembers the last value
    // and emits it after the subject is completed
    const subject = new AsyncSubject<number>();

    // Observer A subscribes to the subject
    // but only receives the value after the subject is completed
    subject.subscribe(observerA);

    setTimeout(() => {
      // Observer B subscribes after 1 second
      // but only receives the value after the subject is completed

      subject.subscribe(observerB);
    }, 1000);

    subject.next(1); // Observer A and B don't receive this value
    subject.next(2); // Observer A and B don't receive this value
    subject.next(3); // Observer A and B will receive this value after the subject is completed

    setTimeout(() => {
      // After 500ms the subject is completed
      // and Observer A will receive the last value (3)
      // Observer B will receive the last value (3) too
      // when it subscribes after 1 second
      subject.complete();
    }, 500);
    /*

      Output:

      Subject:    ---1---2---3-|
      Observer A  -------------3|
      Observer B                 (1,2,3)-|    

    */
  });
});
