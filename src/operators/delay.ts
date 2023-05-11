import { interval, take, from, delayWhen, tap } from 'rxjs';

console.log('Delay operator');

const letters = ['a', 'b', 'c', 'd', 'e'] as const;

const delays = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
} as const satisfies Record<string, number>;

const values$ = from(letters);

// Retrasa el comienzo de la emision del observable 3s
// const result$ = values$.pipe(delay(3000));

const result$ = values$.pipe(
  delayWhen(value => {
    const timeDelay = delays[value] * 1000;

    console.log('Delayed', value, timeDelay);

    return interval(timeDelay).pipe(
      tap(() => console.log('Interval', value)),

      take(1)
    );
  })
);

result$.subscribe({
  next: val => console.log('Emit', val),
  complete: () => console.log('Complete')
});
