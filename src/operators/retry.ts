import { interval, map, tap, take, retry, delay, of } from 'rxjs';

console.log('Retry operator');

const interval$ = interval(1000);

const random$ = interval$.pipe(
  tap(index => console.log('Iteration', index)),

  map(() => Math.random() * 10)
);

// const throwUpper5 = map((value: number) => {
//   if (value < 5) return value;

//   throw new Error(`Upper value: ${value}`);
// });

// const result$ = random$.pipe(
//   throwUpper5,

//   // Requiere 3 emisiones buenas para completarse
//   // pq al reiniciar el observable se reinicia
//   // este operador junto con el observable
//   take(2),

//   // Retry when throw error
//   retry(),

//   // Requiere 6 emisiones buenas
//   // independientemente si son seguidas
//   // o no, pq este operador ya no es parte
//   // del observable ouput$
//   take(6)
// );

const throwUpper2 = map((value: number) => {
  if (value < 2) return value;

  throw new Error(`Upper value: ${value}`);
});

// const result$ = random$.pipe(
//   throwUpper2,

//   // Retry 3 times max
//   retry(3)
// );

const result$ = random$.pipe(
  throwUpper2,

  // Retry 3 times max
  retry({
    count: 3,
    delay: (error, count) => {
      console.log('Error producido', error.message, 'retry en', count, 'seconds');

      return of(1000).pipe(
        delay(1000 * count),
        tap(() => console.log('Retry number', count))
      );
    }
  }),

  take(3)
);

result$.subscribe({
  next: val => console.log('Emit', val),
  error: error => console.log('##### Final Error ', error.message),
  complete: () => console.log('##### Complete')
});
