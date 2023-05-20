import { Observable, interval, tap, OperatorFunction, Subscriber } from 'rxjs';

const ob1$ = interval(1000).pipe(tap(value => console.log('Emit ', value)));

// ~~~~~~ Custom operator
// Receives an observable and returns another observable

function mapToTen(source$: Observable<number>) {
  console.log('Source', source$);

  // ~~~~~~ New observable
  // it will be returned by the operator

  const resultOb$ = new Observable<number>(observer => {
    const subscription = source$.subscribe({
      next: value => observer.next(value * 10),
      error: error => observer.error(error),
      complete: () => observer.complete()
    });

    // ~~~~~~ Unsubscribe function

    return () => {
      subscription.unsubscribe();
    };
  });

  // ~~~~~~ Observable returned by the operator

  return resultOb$;
}

function mapToTenv2(source$: Observable<number>) {
  console.log('Source', source$);

  // ~~~~~~ New observable
  // it will be returned by the operator

  const resultOb$ = new Observable(observer => {
    // return subscription directly instead of
    // a unsubscription function

    return source$.subscribe({
      next: value => observer.next(value * 10),
      error: error => observer.error(error),
      complete: () => observer.complete()
    });
  });

  // ~~~~~~ Observable returned by the operator

  return resultOb$;
}

const resutl$ = ob1$.pipe(mapToTen, mapToTenv2);

const subscription = resutl$.subscribe({
  next: value => console.log('Result', value),
  complete: () => console.log('Completed!')
});

setTimeout(() => subscription.unsubscribe(), 5000);

// ~~~~~~ Rxjs 7 Map

export function mapRxjs7<In, Out>(project: (value: In) => Out): OperatorFunction<In, Out> {
  // Source is the observable received
  // Return a Operator function which is a function that receive an observable
  // and return a new one observable
  return source => {
    // Observable returned by the function

    return new Observable(destination => {
      // Subscribe to the source observable

      const sub = source.subscribe({
        next: value => {
          try {
            // Calculate projection

            const result = project(value);

            // Emit projection result

            destination.next(result);
          } catch (error) {
            // Emit error if projection fails

            destination.error(error);
          }
        },

        // Emit errors

        error: error => destination.error(error),

        // Emit completion

        complete: () => destination.complete()
      });

      // Return subscription to the source observable
      // to enable the completion chain
      return sub;
    });
  };
}

// ~~~~~~ Rxjs 8 Map

export function mapRxjs8<In, Out>(project: (value: In) => Out): OperatorFunction<In, Out> {
  // Source is the observable received
  // Return a Operator function which is a function that receive an observable
  // and return a new one observable
  return source => {
    // Observable returned by the function

    return new Observable(destination => {
      // Subscribe to the source observable

      const sub = source.subscribe(
        // Operate funciton is a utility from rxjs8

        operate({
          destination,
          next: value => {
            // Calculate projection

            const result = project(value);

            // Emit projection result

            destination.next(result);
          }
        })
      );

      // Return subscription to the source observable
      // to enable the completion chain
      return sub;
    });
  };
}

// It will be available in RxJs 8!!!!

type OperatorArgs<In, Out> = {
  // Final subscriber
  destination: Subscriber<Out>;

  // Next function for final subscriber
  next: (value: In) => void;
};

function operate<In, Out>(operators: OperatorArgs<In, Out>): Subscriber<In> {
  throw new Error('Function not implemented.' + operators);
}
