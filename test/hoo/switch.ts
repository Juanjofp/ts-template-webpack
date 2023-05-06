import {
  fromEvent,
  switchMap,
  map,
  interval,
  switchAll,
  switchScan,
  take,
} from 'rxjs';

console.log('Switch/Switchmap operator');

const clicks$ = fromEvent(window, 'click');

// const result$ = clicks$.pipe(
//   map(() => interval(1000)),
//   switchAll()
// );

// const result$ = clicks$.pipe(switchMap(() => interval(1000)));

const result$ = clicks$.pipe(
  switchScan((acc, current, index) => {
    console.log('Acc', acc, current, index);
    return interval(2000).pipe(take(10));
  }, 0)
);

const subs = result$.subscribe({
  next: (value) => console.log('Value', value),
  error: (error) => console.log('Error', error),
  complete: () => console.log('Complete'),
});
