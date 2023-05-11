import { interval, map, catchError, tap, take } from 'rxjs';

console.log('CatchError operator');

const random$ = interval(1000).pipe(
  tap(index => console.log('Iteration', index)),

  map(() => Math.random() * 10)
);

const throwUpper5 = map((value: number) => {
  if (value < 5) return value;

  throw new Error(`Upper value: ${value}`);
});

// Este observable se completa cuando genere 3
// numeros buenos seguidos (sin errores entre ellos)
// o cuando haya generado 6 numeros buenos, independientemente
// de si son seguidos, lo que ocurra primero

const result$ = random$.pipe(
  throwUpper5,

  // Requiere 3 emisiones buenas para completarse
  // pq al reiniciar el observable se reinicia
  // este operador junto con el observable
  take(3),

  catchError((error, output$) => {
    console.log('Error throw with', error.message);

    // Complete observable with 5
    // return of(5);

    // Devuelve la cadena de observables
    // delante de catchError y la reinicia
    return output$;
  }),

  // Requiere 6 emisiones buenas
  // independientemente si son seguidas
  // o no, pq este operador ya no es parte
  // del observable ouput$
  take(6)
);

result$.subscribe({
  next: val => console.log('Emit', val),
  complete: () => console.log('Complete')
});
