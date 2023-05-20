import { BehaviorSubject } from 'rxjs';

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

    const subject = new BehaviorSubject<number>(99);

    subject.subscribe(observerA);

    setTimeout(() => {
      subject.subscribe(observerB);
    }, 1000);

    subject.next(1);
    subject.next(2);

    setTimeout(() => {
      subject.complete();

      done();
    }, 2500);
  });
});

/*

Output:

Subject:    99---1---2--------------|
Observer A  99---1---2--------------|
Observer B                  2-------|    

*/
