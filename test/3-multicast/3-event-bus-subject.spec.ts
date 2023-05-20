import { Subject } from 'rxjs';

describe('Using a subject as an event bus', () => {
  it('Should share an observable between observers', done => {
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

    const subject = new Subject<number>();

    subject.subscribe(observerA);

    setTimeout(() => {
      subject.subscribe(observerB);
    }, 1000);

    subject.next(1); // Only observerA receives this
    subject.next(2); // Only observerA receives this

    // subject.complete(); // ObserverA and ObserverB receives this

    const memo = { value: 3 };
    const interval = setInterval(() => {
      subject.next(memo.value); // Both observers receive this

      memo.value++;

      // Simulate an error, this will be received by both observers
      // and the observable will be finished

      // if (memo.value > 5) {
      //   subject.error(new Error('Something went wrong'));
      // }

      // Simulate a complete, this will be received by both observers
      // and the observable will be completed

      // if (memo.value > 5) {
      //   subject.complete();
      // }
    }, 500);

    setTimeout(() => {
      clearInterval(interval);

      subject.complete();

      done();
    }, 2500);
  });
});

/* 

Console output:  

    Observer A 1
    Observer A 2
    Observer A 3
    Observer A 4
        Observer B 4
    Observer A 5
        Observer B 5
    Observer A 6
        Observer B 6
    Observer A complete
        Observer B complete

Console output with error:

    Observer A 1
    Observer A 2
    Observer A 3
    Observer A 4
        Observer B 4
    Observer A 5
        Observer B 5
    Observer A error Error: Something went wrong
        Observer B error Error: Something went wrong

Console output with complete:

    Observer A 1
    Observer A 2
    Observer A 3
    Observer A 4
        Observer B 4
    Observer A 5
        Observer B 5
    Observer A complete
        Observer B complete

*/
