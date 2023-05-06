import { interval, take, from, delay, delayWhen, tap } from 'rxjs';

console.log('Delay operator');

const letters = ['a', 'b', 'c', 'd', 'e'];
const delays = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5
};
const values$ = from(letters);

// Retrasa el comienzo de la emision del observable 3s
// const result$ = values$.pipe(delay(3000));

const result$ = values$.pipe(
  delayWhen(value => {
    console.log('Delayed', value, delays[value] * 1000);
    return interval(delays[value] * 1000).pipe(
      tap(() => console.log('Interval', value)),
      take(1)
    );
  })
);

const subscription = result$.subscribe({
  next: val => console.log('Emit', val),
  complete: () => console.log('Complete')
});
