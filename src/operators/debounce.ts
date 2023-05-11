import { debounce, interval, fromEvent, first, tap } from 'rxjs';

console.log('Debounce operator');

// Debounce wait for x seconds of silence before emit
// Or x secons after complete
// Drops values in betteen
// Ie. Debounce keyboard press until after 1 seconds
// from last press

const clicks$ = fromEvent(window, 'click');

// const result$ = clicks$.pipe(debounceTime(2000));

const result$ = clicks$.pipe(
  debounce(() => {
    const timeIterval = (1 + Math.random() * 5) * 1000;

    console.log('Waiting for', timeIterval, 'of silence');

    return interval(timeIterval).pipe(
      tap(() => console.log('Silence consumed', timeIterval)),
      first()
    );
  })
);

result$.subscribe({
  next: val => console.log('Emit', val),
  complete: () => console.log('Complete')
});
