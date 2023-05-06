import { Observable, Subject } from 'rxjs';

const ob$ = new Subject();

ob$.subscribe({
  next: value => console.log('Next value', value)
});

ob$.next('Hello');

const ob2$ = new Observable(observer => {
  let count = 0;
  const intervalId = setInterval(() => {
    console.log('Run interval', count);
    observer.next(count);

    count++;
  }, 2000);

  return () => clearInterval(intervalId);
});

const subs = ob2$.subscribe({
  next: value => console.log('Value obs 2', value)
});

setTimeout(() => {
  console.log('Unsuscribe');
  subs.unsubscribe();
}, 6000);
