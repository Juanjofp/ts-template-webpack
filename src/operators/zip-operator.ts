import { from, zip, interval, map } from 'rxjs';

console.log('Zip operator');

const syncObs$ = from([1, 2, 3, 4, 5]);

const asyncObs$ = interval(1000);

const result$ = zip(syncObs$, asyncObs$).pipe(map(([val]) => val));

// const result$ = zip([syncObs$, asyncObs$]).pipe(map(([val]) => val));

// const result$ = zip([syncObs$, asyncObs$], (x, _) => x);

// const result$ = zip([syncObs$, asyncObs$], (...values) => values[0]);

result$.subscribe({
  next: val => console.log('Emit', val),
  complete: () => console.log('Complete')
});
