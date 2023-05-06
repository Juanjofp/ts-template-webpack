import { interval, take, map, bufferCount, buffer, bufferTime } from 'rxjs';

console.log('Buffer operator');

const letters = ['a', 'b', 'c', 'd', 'e'];
const values$ = interval(1000).pipe(
  take(5),
  map(index => letters[index])
);

// const result$ = values$.pipe(bufferCount(2));

// const signal$ = interval(500);
// const result$ = values$.pipe(buffer(signal$));

const result$ = values$.pipe(bufferTime(2000));

const subscription = result$.subscribe({
  next: val => console.log('Emit', val),
  complete: () => console.log('Complete')
});
