import { Subject, interval, switchMap, EMPTY, tap, of } from 'rxjs';

// ~~~~~~ Helper time functions ~~~~~~

const diffTime = (initAt: number) => `[${(Date.now() - initAt) / 1000}]> `;

describe('Pause and resume', () => {
  jest.setTimeout(10000);

  // Implement a pause and resume functionality

  it('should pause and resume', done => {
    const initialTime = Date.now();

    // Subject to pause and resume

    const resume$ = new Subject<boolean>();

    // Create an observable that emits a value every 500ms

    const source$ = interval(500);

    // Pause and resume the source observable

    const result$ = resume$.pipe(
      switchMap(resume => (resume ? source$ : EMPTY)),

      tap(value => console.log(diffTime(initialTime), 'Resume action!', value)),

      switchMap(value => {
        console.log(diffTime(initialTime), 'Execute action', value);

        return of('Action executed!');
      })
    );

    // Subscribe to the result observable

    const sub = result$.subscribe({
      next: value => {
        console.log(diffTime(initialTime), 'Next: ', value);
      }
    });

    // Resume observable

    resume$.next(true);

    // Pause observable after 2 seconds

    setTimeout(() => {
      console.log(diffTime(initialTime), 'Pause observable');

      resume$.next(false);
    }, 2000);

    // Resume observable after 4 seconds

    setTimeout(() => {
      console.log(diffTime(initialTime), 'Resume observable');

      resume$.next(true);
    }, 4000);

    // Pause observable after 5.5 seconds

    setTimeout(() => {
      console.log(diffTime(initialTime), 'Pause observable');

      resume$.next(false);
    }, 5500);

    // Unsuscribe from observable after 6 seconds

    setTimeout(() => {
      sub.unsubscribe();

      console.log(diffTime(initialTime), 'Unsuscribe from observable');

      done();
    }, 6000);
  });
});
