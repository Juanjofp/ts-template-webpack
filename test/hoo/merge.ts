import {
  fromEvent,
  mergeMap,
  map,
  interval,
  mergeAll,
  mergeScan,
  take,
} from 'rxjs';

console.log('Merge/Mergemap operator');

const clicks$ = fromEvent(window, 'click');

// const result$ = clicks$.pipe(
//   map(() => interval(1000)),
//   mergeAll()
// );

// const result$ = clicks$.pipe(
//   map(() => interval(1000)),
//   mergeAll(2)
// );

// const result$ = clicks$.pipe(mergeMap(() => interval(1000)));

const result$ = clicks$.pipe(mergeMap(() => interval(1000).pipe(take(5)), 2));

// const result$ = clicks$.pipe(
//   mergeScan((acc, current, index) => {
//     console.log('Acc', acc, current, index);
//     return interval(2000).pipe(take(10));
//   }, 0)
// );

const subs = result$.subscribe({
  next: (value) => console.log('Value', value),
  error: (error) => console.log('Error', error),
  complete: () => console.log('Complete'),
});
