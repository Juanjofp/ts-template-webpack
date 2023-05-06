import { scan, interval, take } from 'rxjs';

console.log('Scan operator');

const values$ = interval(1000).pipe(take(5));

const result$ = values$.pipe(
  scan((acc, value, index) => {
    return acc + value + index;
  }, 0)
);

const subscription = result$.subscribe({
  next: val => console.log('Emit', val),
  complete: () => console.log('Complete')
});
