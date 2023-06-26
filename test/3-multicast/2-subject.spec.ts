import { interval, take, Subject } from 'rxjs';

describe('A Subject', () => {
  it('Should share an observable between observers', done => {
    // Subject

    // ~~~~~~ Create observable

    const obs$ = interval(500).pipe(take(5));

    // Create bridge

    const subject = new Subject<number>();

    // Subscribe bridge to observable
    // obs$ start emitting values

    obs$.subscribe(subject);

    // Subscribe subscriber1 to bridge

    setTimeout(() => {
      subject.subscribe({
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
    }, 1100);

    // Subcribe subscriber 2 after 2 seconds

    setTimeout(() => {
      subject.subscribe({
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
