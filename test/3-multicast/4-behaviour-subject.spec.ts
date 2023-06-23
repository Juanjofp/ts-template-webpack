import { BehaviorSubject } from 'rxjs';

// BehaviorSubject: replays one, only before completion

describe('Using a Behaviour subject', () => {
  it('Should share an observable between observers and remember the last value', done => {
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

    const subject = new BehaviorSubject(99);

    subject.subscribe(observerA);

    setTimeout(() => {
      // Observer B subscribes after 1 second
      // and receives the last value (2)
      // because BehaviourSubject remembers the last value
      // and emits it to new subscribers

      subject.subscribe(observerB);
    }, 1000);

    subject.next(1);
    subject.next(2);

    setTimeout(() => {
      subject.complete();

      done();
    }, 2500);

    /*

      Output:

      Subject:    99---1---2--------------|
      Observer A  99---1---2--------------|
      Observer B                  2-------|    

    */
  });

  it('Should share an observable between observers and remember the last value', done => {
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

    const subject = new BehaviorSubject(99);

    subject.subscribe(observerA);

    setTimeout(() => {
      // Observer B subscribes after 1 second
      // and completes immediately
      // because BehaviourSubject is completed

      subject.subscribe(observerB);
    }, 1000);

    subject.next(1);
    subject.next(2);
    subject.complete();

    setTimeout(() => {
      done();
    }, 2500);

    /*

      Output:

      Subject:    99---1---2-|
      Observer A  99---1---2-|
      Observer B            -|    

    */
  });
});
