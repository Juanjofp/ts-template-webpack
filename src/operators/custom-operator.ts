import { Observable, interval, tap } from 'rxjs';

const ob1$ = interval(1000).pipe(tap(value => console.log('Emit ', value)));

function mapToTen(source$: Observable<number>) {
  console.log('Source', source$);

  const resultOb$ = new Observable<number>(observer => {
    const subscription = source$.subscribe({
      next: value => observer.next(value * 10),
      error: error => observer.error(error),
      complete: () => observer.complete()
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  return resultOb$;
}

function mapToTenv2(source$: Observable<number>) {
  console.log('Source', source$);

  const resultOb$ = new Observable(observer => {
    // return subscription directly instead of
    // a unsubscription function

    return source$.subscribe({
      next: value => observer.next(value * 10),
      error: error => observer.error(error),
      complete: () => observer.complete()
    });
  });

  return resultOb$;
}

const resutl$ = ob1$.pipe(mapToTen, mapToTenv2);

const subscription = resutl$.subscribe({
  next: value => console.log('Result', value),
  complete: () => console.log('Completed!')
});

setTimeout(() => subscription.unsubscribe(), 5000);
